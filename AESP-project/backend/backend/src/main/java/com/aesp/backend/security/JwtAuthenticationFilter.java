package com.aesp.backend.security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.aesp.backend.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);

                if (jwtUtils.validateToken(token)) {
                    String email = jwtUtils.getEmailFromToken(token);

                    if (email != null) {
                        // Logic bạn vừa sửa: Lấy User và Role từ DB
                        userRepository.findByEmail(email).ifPresent(user -> {
                            List<SimpleGrantedAuthority> authorities = new ArrayList<>();

                            if (user.getRole() != null) {
                                authorities.add(new SimpleGrantedAuthority(user.getRole()));
                                authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
                            }

                            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                    email, null, authorities); // Đã có quyền

                            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(authToken);
                        });
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Không thể xác thực người dùng: {}", e);
        }

        // --- QUAN TRỌNG: Dòng này bắt buộc phải nằm NGOÀI CÙNG ---
        // Để dù có Token hay không, request vẫn được đi tiếp (đến Controller hoặc
        // Login)
        filterChain.doFilter(request, response);
    }
}