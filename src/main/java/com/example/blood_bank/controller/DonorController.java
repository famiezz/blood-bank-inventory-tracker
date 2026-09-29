package com.example.blood_bank.controller;

import com.example.blood_bank.entity.Donor;
import com.example.blood_bank.service.DonorService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donors")
public class DonorController {

    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }

    @PostMapping
    public Donor addDonor(@Valid @RequestBody Donor donor) {
        return donorService.addDonor(donor);
    }

    @GetMapping
    public List<Donor> getAllDonors() {
        return donorService.getAllDonors();
    }

    @DeleteMapping("/{id}")
    public void deleteDonor(@PathVariable Long id) {
        donorService.deleteDonor(id);
    }
}