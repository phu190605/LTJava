package com.aesp.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatUploadController {

    private static final String UPLOAD_DIR = "uploads/chat";

    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String original = file.getOriginalFilename();
            String ext = "";
            if (original != null && original.contains(".")) {
                ext = original.substring(original.lastIndexOf("."));
            }

            String filename = UUID.randomUUID() + ext;
            Path filePath = uploadPath.resolve(filename);

            file.transferTo(filePath.toFile());

            String type = file.getContentType() != null
                    && file.getContentType().startsWith("image")
                    ? "IMAGE"
                    : "FILE";

            Map<String, Object> res = new HashMap<>();
            res.put("url", "/uploads/chat/" + filename);
            res.put("type", type);

            return ResponseEntity.ok(res);

        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.badRequest().body("Upload failed");
        }
    }
}
