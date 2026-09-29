package com.example.blood_bank.repository;

import com.example.blood_bank.entity.BloodUnit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BloodUnitRepository extends JpaRepository<BloodUnit, Long> {
}