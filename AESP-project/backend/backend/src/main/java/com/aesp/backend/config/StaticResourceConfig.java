package com.aesp.backend.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        Path avatarDir = Paths.get("avatars");
        Path certificateDir = Paths.get("certificates");
        Path materialDir = Paths.get("materials");

        String avatarPath = avatarDir.toFile().getAbsolutePath();
        String certificatePath = certificateDir.toFile().getAbsolutePath();
        String materialPath = materialDir.toFile().getAbsolutePath();

        registry.addResourceHandler("/avatars/**")
                .addResourceLocations("file:" + avatarPath + "/");

        registry.addResourceHandler("/certificates/**")
                .addResourceLocations("file:" + certificatePath + "/");

        registry.addResourceHandler("/materials/**")
                .addResourceLocations("file:" + materialPath + "/");
    }
}
