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
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 1. Cho phép Login/Register truy cập không cần token
                        .requestMatchers(
                                "/api/auth/login", 
                                "/api/auth/register", 
                                "/api/auth/admin/login"
                        ).permitAll()

                        // 2. BẮT BUỘC API /me phải có token để lấy dữ liệu User (Sửa lỗi 401)
                        .requestMatchers("/api/auth/me").authenticated()

                        // 3. Các tài nguyên khác cho phép truy cập tự do (hoặc giữ nguyên cấu trúc của bạn)
                        .requestMatchers(
                                "/error",
                                "/ws/**",
                                "/peer/**",
                                "/api/chat/**",
                                "/api/speech/**",
                                "/api/sentences/**",
                                "/api/profile/goals",
                                "/api/profile/topics",
                                "/api/profile/packages",
                                "/api/test-questions/**",
                                "/api/gamification/stats/**",
                                "/api/gamification/challenges/**",
                                "/api/gamification/simulate-speaking"
                        ).permitAll()
                        
                        // 4. Các API profile còn lại bắt buộc đăng nhập
                        .requestMatchers("/api/profile/**").authenticated()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        // Cho phép frontend từ localhost:5173 truy cập
        configuration.setAllowedOriginPatterns(Arrays.asList("*")); 
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}