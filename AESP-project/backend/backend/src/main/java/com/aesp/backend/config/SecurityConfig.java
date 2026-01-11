package com.aesp.backend.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Sử dụng cấu hình CORS bên dưới
            .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**", "/error", "/ws/**", "/api/chat/**", "/api/speech/**", "/api/sentences/**","/api/topics/**","/api/chat-history/**").permitAll()
            .requestMatchers("/api/topics/**").permitAll()
            .anyRequest().authenticated() // Các API khác phải đăng nhập
            );
        
        return http.build();
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 🟢 QUAN TRỌNG: Cho phép Credentials (Cookie/Auth Header)
        configuration.setAllowCredentials(true);
        
        // 🟢 SỬA LỖI: Dùng setAllowedOriginPatterns thay vì setAllowedOrigins
        // Dấu "*" ở đây nghĩa là cho phép mọi localhost hoặc domain
        configuration.setAllowedOriginPatterns(Arrays.asList("*")); 

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*")); // Cho phép mọi header
        configuration.setExposedHeaders(Arrays.asList("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}