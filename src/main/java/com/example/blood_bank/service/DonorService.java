package com.example.blood_bank.service;

import com.example.blood_bank.entity.Donor;
import com.example.blood_bank.repository.DonorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonorService {

    private final DonorRepository donorRepository;

    public DonorService(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    public Donor addDonor(Donor donor) {
        return donorRepository.save(donor);
    }

    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    public void deleteDonor(Long id) {
        donorRepository.deleteById(id);
    }
}