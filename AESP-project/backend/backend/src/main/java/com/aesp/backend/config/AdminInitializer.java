package com.aesp.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.aesp.backend.entity.User;
import com.aesp.backend.repository.UserRepository;

@Component
public class AdminInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@aesp.com";
        String adminPassword = "admin123"; // default dev password

        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setFullName("Admin");
            admin.setRole("ADMIN");
            admin.setPassword(passwordEncoder.encode(adminPassword));
            userRepository.save(admin);
            System.out.println("[AdminInitializer] Created default admin: " + adminEmail);
        } else {
            System.out.println("[AdminInitializer] Admin already exists: " + adminEmail);
        }
    }
}