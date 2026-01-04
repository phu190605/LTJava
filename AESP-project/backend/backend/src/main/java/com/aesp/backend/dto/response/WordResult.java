package com.aesp.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WordResult {
    private String word;          // Từ: "cat"
    private double accuracyScore; // Điểm của riêng từ này: 45.0
    private String errorType;     // Loại lỗi: "Mispronunciation" (Sai), "Omission" (Thiếu), "None" (Đúng)
}
