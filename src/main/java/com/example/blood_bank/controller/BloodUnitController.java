package com.example.blood_bank.controller;

import com.example.blood_bank.entity.BloodUnit;
import com.example.blood_bank.service.BloodUnitService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blood-units")
public class BloodUnitController {

    private final BloodUnitService bloodUnitService;

    public BloodUnitController(BloodUnitService bloodUnitService) {
        this.bloodUnitService = bloodUnitService;
    }

    @PostMapping
    public BloodUnit addBloodUnit(@RequestBody BloodUnit bloodUnit) {
        return bloodUnitService.addBloodUnit(bloodUnit);
    }

    @GetMapping
    public List<BloodUnit> getAllBloodUnits() {
        return bloodUnitService.getAllBloodUnits();
    }

    @GetMapping("/stock")
    public Map<String, Integer> getCurrentStock() {
        return bloodUnitService.getCurrentStock();
    }

    @GetMapping("/expiring-soon")
    public List<BloodUnit> getExpiringSoon() {
        return bloodUnitService.getExpiringSoon();
    }
}