package com.aesp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aesp.backend.entity.ServicePackage;

@Repository
public interface ServicePackageRepository extends JpaRepository<ServicePackage, Integer> {
}
