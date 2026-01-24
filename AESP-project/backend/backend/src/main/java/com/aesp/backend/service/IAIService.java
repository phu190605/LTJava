package com.aesp.backend.service;

public interface IAIService {
    // Tất cả các AI Service bắt buộc phải có hàm này
    String chatWithAI(String message);
    
    // Để biết tên service nào đang chạy
    String getServiceName();
}