package com.aesp.backend.filter;

import com.aesp.backend.service.ModerationService;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.util.ContentCachingRequestWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ContentModerationFilter implements Filter {

    private final ModerationService moderationService;

    // Endpoints to apply moderation to
    private static final List<String> MODERATED_ENDPOINTS = Arrays.asList(
            "/api/v1/chat",
            "/api/v1/comments",
            "/api/v1/feedback"
    );

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String requestURI = httpRequest.getRequestURI();

        // Check if this endpoint should be moderated
        boolean shouldModerate = MODERATED_ENDPOINTS.stream()
                .anyMatch(requestURI::contains);

        if (!shouldModerate || !httpRequest.getMethod().equals("POST")) {
            chain.doFilter(request, response);
            return;
        }

        // Wrap request to read body multiple times
        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(httpRequest, 10240);

        try {
            // Read request body
            String body = getRequestBody(wrappedRequest);

            if (body != null && !body.isEmpty()) {
                // Check for toxic content
                ModerationService.ModerationResult result = moderationService.moderateWithDetails(body);

                if (!result.isClean()) {
                    log.warn("Toxic content blocked on endpoint: {} - Reason: {}", 
                            requestURI, result.getReason());

                    // Block the request
                    httpResponse.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    httpResponse.setContentType("application/json");
                    httpResponse.getWriter().write(String.format(
                            "{\"error\": \"Content blocked\", \"reason\": \"%s\", \"flaggedWords\": %s}",
                            result.getReason(),
                            result.getFlaggedWords()
                    ));
                    return;
                }
            }

            // Continue with the request if content is clean
            chain.doFilter(wrappedRequest, response);

        } catch (Exception e) {
            log.error("Error in content moderation filter", e);
            // Continue with request on error to avoid blocking legitimate content
            chain.doFilter(wrappedRequest, response);
        }
    }

    /**
     * Extract request body from wrapped request
     */
    private String getRequestBody(ContentCachingRequestWrapper request) {
        try {
            byte[] buf = request.getContentAsByteArray();
            if (buf.length > 0) {
                return new String(buf, 0, buf.length, StandardCharsets.UTF_8);
            }
        } catch (Exception e) {
            log.error("Error reading request body", e);
        }
        return null;
    }
}
