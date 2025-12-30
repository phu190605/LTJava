package com.aesp.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired; // Nhớ tạo file này nhé
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aesp.backend.entity.ServicePackage;
import com.aesp.backend.repository.ServicePackageRepository;

@RestController
@RequestMapping("/api/service-packages") // Giữ đúng đường dẫn cũ để Frontend gọi
@CrossOrigin("*")
public class ServicePackageController {

    @Autowired
    private ServicePackageRepository servicePackageRepository;

    // API: Lấy danh sách tất cả gói cước
    @GetMapping
    public ResponseEntity<List<ServicePackage>> getAllPackages() {
        // Gọi xuống DB lấy 3 gói (Cơ bản, Chuyên nghiệp, Cao cấp) lên
        List<ServicePackage> packages = servicePackageRepository.findAll();
        return ResponseEntity.ok(packages);
    }
    
    // API: Lấy chi tiết 1 gói (để trang thanh toán gọi)
    @GetMapping("/{id}")
    public ResponseEntity<ServicePackage> getPackageById(@PathVariable Integer id) {
        return servicePackageRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}