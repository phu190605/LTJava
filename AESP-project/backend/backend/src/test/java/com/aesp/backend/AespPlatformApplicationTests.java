package com.aesp.backend;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AespPlatformApplicationTests {

    @LocalServerPort
    private int port;

    @Test
    void contextLoads() {
    }

    @Test
    void smokeChatEndpoint() {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String body = "{\"message\":\"Hello from integration test\"}";
        HttpEntity<String> entity = new HttpEntity<>(body, headers);
        String url = "http://localhost:" + port + "/api/chat/ask";
        ResponseEntity<String> resp = restTemplate.postForEntity(url, entity, String.class);
        Assertions.assertEquals(200, resp.getStatusCode().value());
        Assertions.assertNotNull(resp.getBody());
        Assertions.assertFalse(resp.getBody().isEmpty());
    }

}
