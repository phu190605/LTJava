package com.aesp.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;


@Configuration
public class AzureConfig {

    @Value("${azure.speech.key}")
    private String speechKey;

    @Value("${azure.speech.region}")
    private String speechRegion;

    public String getSpeechKey() {
        return speechKey;
    }

    public String getSpeechRegion() {
        return speechRegion;
    }
}