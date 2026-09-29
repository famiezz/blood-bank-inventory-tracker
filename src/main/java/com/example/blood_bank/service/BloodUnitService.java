package com.example.blood_bank.service;

import com.example.blood_bank.entity.BloodUnit;
import com.example.blood_bank.repository.BloodUnitRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BloodUnitService {

    private final BloodUnitRepository bloodUnitRepository;

    public BloodUnitService(BloodUnitRepository bloodUnitRepository) {
        this.bloodUnitRepository = bloodUnitRepository;
    }

    public BloodUnit addBloodUnit(BloodUnit bloodUnit) {
        return bloodUnitRepository.save(bloodUnit);
    }

    public List<BloodUnit> getAllBloodUnits() {
        return bloodUnitRepository.findAll();
    }

    public Map<String, Integer> getCurrentStock() {

        LocalDate today = LocalDate.now();

        List<BloodUnit> allUnits = bloodUnitRepository.findAll();

        Map<String, Integer> stock = new HashMap<>();

        for (BloodUnit unit : allUnits) {

            if ("AVAILABLE".equals(unit.getStatus())
                    && unit.getExpiryDate() != null
                    && !unit.getExpiryDate().isBefore(today)) {

                String bloodGroup = unit.getBloodGroup();

                stock.put(
                        bloodGroup,
                        stock.getOrDefault(bloodGroup, 0) + 1
                );
            }
        }

        return stock;
    }

    public List<BloodUnit> getExpiringSoon() {

        LocalDate today = LocalDate.now();
        LocalDate sevenDaysFromNow = today.plusDays(7);

        List<BloodUnit> allUnits = bloodUnitRepository.findAll();

        return allUnits.stream()
                .filter(unit -> "AVAILABLE".equals(unit.getStatus()))
                .filter(unit -> unit.getExpiryDate() != null)
                .filter(unit -> !unit.getExpiryDate().isBefore(today))
                .filter(unit -> !unit.getExpiryDate().isAfter(sevenDaysFromNow))
                .toList();
    }
}