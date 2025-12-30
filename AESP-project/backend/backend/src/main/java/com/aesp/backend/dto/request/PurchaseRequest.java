package com.aesp.backend.dto.request;

import lombok.Data;

@Data
public class PurchaseRequest {
    private Long userId;       // ID người mua
    private Integer packageId; // ID gói muốn mua
}