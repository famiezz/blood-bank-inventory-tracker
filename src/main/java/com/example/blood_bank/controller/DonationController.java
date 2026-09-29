package com.example.blood_bank.controller;

import com.example.blood_bank.entity.Donation;
import com.example.blood_bank.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @PostMapping
    public Donation addDonation(@Valid @RequestBody Donation donation) {
        return donationService.addDonation(donation);
    }

    @GetMapping
    public List<Donation> getAllDonations() {
        return donationService.getAllDonations();
    }
}