package com.aesp.backend.controller;

import com.aesp.backend.entity.ServicePackage;
import com.aesp.backend.repository.ServicePackageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/service-packages")
@CrossOrigin("*")
public class AdminServicePackageController {

    private final ServicePackageRepository repo;

    public AdminServicePackageController(ServicePackageRepository repo) {
        this.repo = repo;
    }

    // ✅ 1. Xem tất cả gói
    @GetMapping
    public List<ServicePackage> getAll() {
        return repo.findAll();
    }

    // ✅ 2. Xem chi tiết 1 gói
    @GetMapping("/{id}")
    public ServicePackage getById(@PathVariable Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));
    }

    // ✅ 3. THÊM gói mới
    @PostMapping
    public ServicePackage create(@RequestBody ServicePackage req) {
        return repo.save(req);
    }

    // ✅ 4. SỬA gói
    @PutMapping("/{id}")
    public ServicePackage update(@PathVariable Integer id,
                                 @RequestBody ServicePackage req) {

        ServicePackage pkg = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        pkg.setPackageName(req.getPackageName());
        pkg.setPrice(req.getPrice());
        pkg.setDurationMonths(req.getDurationMonths());
        pkg.setDescription(req.getDescription());
        pkg.setFeatures(req.getFeatures());
        pkg.setHasMentor(req.getHasMentor());

        return repo.save(pkg);
    }

    // ✅ 5. XOÁ gói
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Package not found");
        }
        repo.deleteById(id);
    }
}
