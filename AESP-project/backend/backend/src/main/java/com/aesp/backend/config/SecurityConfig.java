package com.aesp.backend.config;

import com.aesp.backend.security.JwtAuthenticationFilter;
import com.aesp.backend.service.UserService;
import com.aesp.backend.service.impl.UserServiceImpl;

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

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserService userService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Sử dụng @Lazy để tránh vòng lặp dependencies nếu có
    public SecurityConfig(@Lazy UserService userService, JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.userService = userService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Cấu hình CORS và CSRF
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())

            // 2. Thiết lập Session là STATELESS (Không lưu phiên đăng nhập)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 3. Phân quyền truy cập (Quan trọng)
            .authorizeHttpRequests(auth -> auth
                // --- NHÓM PUBLIC (Ai cũng vào được) ---
                .requestMatchers("/api/auth/**").permitAll() // Đăng nhập, Đăng ký
                .requestMatchers(HttpMethod.GET, "/api/service-packages/**").permitAll() // Xem danh sách gói
                .requestMatchers(HttpMethod.GET, "/api/subscription/packages").permitAll()
                .requestMatchers("/api/profile/goals", "/api/profile/topics").permitAll() // Dữ liệu chung cho Setup

                // --- NHÓM ADMIN (Chỉ Admin mới được thao tác) ---
                .requestMatchers(HttpMethod.POST, "/api/service-packages/**").hasAuthority("ADMIN") // Thêm gói
                .requestMatchers(HttpMethod.PUT, "/api/service-packages/**").hasAuthority("ADMIN")  // Sửa gói
                .requestMatchers(HttpMethod.DELETE, "/api/service-packages/**").hasAuthority("ADMIN") // Xóa gói
                .requestMatchers("/api/admin/**").hasAuthority("ADMIN") // Các API quản trị khác

                // --- NHÓM AUTHENTICATED (Phải đăng nhập mới được vào) ---
                .requestMatchers("/api/profile/**").authenticated() // Xem/Sửa hồ sơ
                .requestMatchers("/api/payment/**").authenticated() // Xem lịch sử thanh toán
                .requestMatchers("/api/subscription/upgrade").authenticated() // Mua gói
                
                // Mọi request khác đều bắt buộc đăng nhập
                .anyRequest().authenticated()
            );

        // 4. Thêm bộ lọc JWT vào trước bộ lọc xác thực mặc định
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Cấu hình CORS để Frontend (localhost:5173) gọi được API
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true); // Cho phép gửi cookie/token
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000")); // Các domain được phép
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Các phương thức được phép
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control")); // Các header được phép
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }
}