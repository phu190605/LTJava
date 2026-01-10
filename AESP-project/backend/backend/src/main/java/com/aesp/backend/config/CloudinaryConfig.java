package com.aesp.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", "dzhiudnhu",
            "api_key", "418332459321611",
            "api_secret", "KyUgBbWmPzcIOswoC87MACNbdSI"
        ));
    }
}


