package com.aesp.backend.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.aesp.backend.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Cấu hình chung: CORS, CSRF và Stateless Session
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 2. Cấu hình phân quyền Request
            .authorizeHttpRequests(auth -> auth
                // Cho phép các API Auth cơ bản và Quên mật khẩu truy cập tự do
                .requestMatchers(
                    "/api/auth/login", 
                    "/api/auth/register", 
                    "/api/auth/admin/login",
                    "/api/auth/forgot-password",
                    "/api/auth/verify-otp",
                    "/api/auth/reset-password"
                ).permitAll()

                // Cho phép các tài nguyên hệ thống và API chức năng công khai
                .requestMatchers(
                    "/error",
                    "/ws/**",
                    "/peer/**",
                    "/api/topics/**",
                    "/api/chat/**",
                    "/api/chat-history/**",
                    "/api/speech/**",
                    "/api/sentences/**",
                    "/api/test-questions/**",
                    "/api/profile/goals",
                    "/api/profile/topics",
                    "/api/profile/packages",
                    "/api/gamification/simulate-speaking"
                ).permitAll()

                // BẮT BUỘC API lấy thông tin cá nhân và quản lý Profile phải có Token
                .requestMatchers("/api/auth/me").authenticated()
                .requestMatchers("/api/profile/**").authenticated()
                .requestMatchers("/api/gamification/stats/**").authenticated()
                .requestMatchers("/api/gamification/challenges/**").authenticated()

                // Tất cả các request khác đều cần xác thực
                .anyRequest().authenticated()
            )
            
            // 3. Thêm Filter kiểm tra JWT trước filter xác thực mặc định
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        // Trong môi trường dev, cho phép tất cả các nguồn hoặc chỉ định http://localhost:5173
        configuration.setAllowedOriginPatterns(Arrays.asList("*")); 
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}