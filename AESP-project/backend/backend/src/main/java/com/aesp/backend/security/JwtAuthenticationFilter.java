package com.aesp.backend.security;


import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.aesp.backend.repository.UserRepository;
import com.aesp.backend.entity.User;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

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
                        userRepository.findByEmail(email).ifPresent(user -> {
                            List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                            if (user.getRole() != null) {
                                authorities.add(new SimpleGrantedAuthority(user.getRole()));
                                authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole()));
                            }

                            // Principal là đối tượng user, không phải email (String)
                            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                    user, null, authorities); 

                            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(authToken);
                        });
                    }
                }
            }
        } catch (Exception e) {
            // SỬA LỖI BIÊN DỊCH Ở ĐÂY: Truyền 'e' thay vì 'e.getMessage()'
            logger.error("Không thể xác thực người dùng: ", e); 
        }

        filterChain.doFilter(request, response);
    }
}