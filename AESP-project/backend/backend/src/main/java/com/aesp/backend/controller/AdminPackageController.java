package com.aesp.backend.controller;

import com.aesp.backend.entity.ServicePackage;
import com.aesp.backend.repository.ServicePackageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/service-packages")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminPackageController {

    private final ServicePackageRepository packageRepository;

    public AdminPackageController(ServicePackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    @PostMapping
    public ServicePackage createPackage(@RequestBody ServicePackage newPackage) {
        return packageRepository.save(newPackage);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ServicePackage> updatePackage(@PathVariable Integer id, @RequestBody ServicePackage packageDetails) {
        return packageRepository.findById(id)
                .map(existingPackage -> {
                    existingPackage.setPackageName(packageDetails.getPackageName());
                    existingPackage.setPrice(packageDetails.getPrice());
                    existingPackage.setDurationMonths(packageDetails.getDurationMonths());
                    existingPackage.setHasMentor(packageDetails.getHasMentor());
                    existingPackage.setDescription(packageDetails.getDescription());
                    existingPackage.setFeatures(packageDetails.getFeatures());
    
                    existingPackage.setActive(packageDetails.isActive()); 
                    
                    ServicePackage updatedPackage = packageRepository.save(existingPackage);
                    return ResponseEntity.ok(updatedPackage);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePackage(@PathVariable Integer id) {
        if (packageRepository.existsById(id)) {
            packageRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}