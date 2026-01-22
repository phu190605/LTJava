package com.aesp.backend.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {

    // Key
    private static final String SECRET_STRING = "2f8e7c1a-4b3d-4e2a-9c1b-7e6f5d4c3b2a-2026-01-06-!AESP!@#";

    // Hàm chuyển đổi chuỗi String sang Key object chuẩn
    private SecretKey getSigningKey() {
        byte[] keyBytes = SECRET_STRING.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // 1. Tạo Token (Sửa lại dùng HS256 và key chuẩn)
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + 86400000)) // 1 ngày
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // <--- Đã đổi sang HS256 an toàn
                .compact();
    }

    // 2. Lấy Email từ Token
    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // 3. Kiểm tra Token hợp lệ
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // Log lỗi nếu cần thiết
            // e.printStackTrace();
            return false;
        }
    }
}