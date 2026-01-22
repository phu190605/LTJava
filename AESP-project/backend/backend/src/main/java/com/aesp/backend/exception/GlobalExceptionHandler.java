package com.aesp.backend.exception;

import java.io.IOException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Bắt lỗi file quá nặng
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<String> handleMaxSizeException(MaxUploadSizeExceededException exc) {
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body("File quá lớn! Vui lòng gửi file dưới 5MB.");
    }

    // Bắt lỗi IO (ví dụ lỗi đọc file hoặc lỗi mạng Azure)
    @ExceptionHandler(IOException.class)
    public ResponseEntity<String> handleIOException(IOException exc) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Lỗi xử lý file hoặc kết nối Azure: " + exc.getMessage());
    }
}