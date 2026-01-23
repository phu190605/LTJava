package com.aesp.backend.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.aesp.backend.security.JwtAuthenticationFilter;
import com.aesp.backend.service.UserService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserService userService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            @Lazy UserService userService,
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.userService = userService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /**
     * ===================== MAIN SECURITY FILTER CHAIN =====================
     * ✔ CHỈ 1 FILTER CHAIN
     * ✔ GỘP RULE CỦA FILE CŨ
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth

                // ================= AUTH =================
                .requestMatchers("/api/auth/**").permitAll()

                // ================= PUBLIC / NO AUTH =================
                .requestMatchers(
                        "/error",
                        "/ws/**",
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

                // ================= PUBLIC GET =================
                .requestMatchers(HttpMethod.GET, "/api/public/mentors").permitAll()

                // ================= STATIC FILES =================
                .requestMatchers(
                        "/avatars/**",
                        "/materials/**",
                        "/certificates/**"
                ).permitAll()

                // ================= ROLE =================
                .requestMatchers("/api/mentor/**").hasRole("MENTOR")
                .requestMatchers("/api/learner/**").hasRole("LEARNER")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // ================= DEFAULT =================
                .anyRequest().authenticated()
            );

        http.addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }

    // ===================== CORS =====================

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(
                Arrays.asList("http://localhost:5173", "http://localhost:3000")
        );
        config.setAllowedMethods(
                Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );
        config.setAllowedHeaders(
                Arrays.asList("Authorization", "Content-Type", "Cache-Control")
        );

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }

    // ===================== AUTH =====================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig
    ) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
