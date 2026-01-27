package com.aesp.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {


        registry.addResourceHandler("/materials/**")
                .addResourceLocations("file:materials/");


        registry.addResourceHandler("/audio/**")
                .addResourceLocations("file:audio/");

        Path uploadDir = Paths.get("uploads/chat")
                .toAbsolutePath()
                .normalize();

        registry.addResourceHandler("/uploads/chat/**")
                .addResourceLocations("file:" + uploadDir + "/");
    }
}
