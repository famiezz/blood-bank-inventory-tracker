package com.example.blood_bank.service;

import com.example.blood_bank.entity.BloodUnit;
import com.example.blood_bank.entity.Donation;
import com.example.blood_bank.entity.Donor;
import com.example.blood_bank.repository.BloodUnitRepository;
import com.example.blood_bank.repository.DonationRepository;
import com.example.blood_bank.repository.DonorRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class DonationService {

    private final DonationRepository donationRepository;
    private final DonorRepository donorRepository;
    private final BloodUnitRepository bloodUnitRepository;

    public DonationService(DonationRepository donationRepository,
                           DonorRepository donorRepository,
                           BloodUnitRepository bloodUnitRepository) {
        this.donationRepository = donationRepository;
        this.donorRepository = donorRepository;
        this.bloodUnitRepository = bloodUnitRepository;
    }

    public Donation addDonation(Donation donation) {

        Long donorId = donation.getDonor().getId();

        Donor donor = donorRepository.findById(donorId)
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        if (donor.getLastDonationDate() != null) {

            LocalDate today = LocalDate.now();

            long daysSinceLastDonation =
                    ChronoUnit.DAYS.between(
                            donor.getLastDonationDate(),
                            today
                    );

            if (daysSinceLastDonation < 90) {
                throw new RuntimeException(
                        "Donor is not eligible. Minimum gap of 90 days is required."
                );
            }
        }

        donation.setDonor(donor);

        donor.setLastDonationDate(donation.getCollectionDate());
        donorRepository.save(donor);

        Donation savedDonation = donationRepository.save(donation);

        for (int i = 0; i < donation.getUnits(); i++) {

            BloodUnit bloodUnit = new BloodUnit();

            bloodUnit.setBloodGroup(donor.getBloodGroup());
            bloodUnit.setCollectionDate(donation.getCollectionDate());
            bloodUnit.setExpiryDate(donation.getExpiryDate());
            bloodUnit.setStatus("AVAILABLE");
            bloodUnit.setDonation(savedDonation);

            bloodUnitRepository.save(bloodUnit);
        }

        return savedDonation;
    }

    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }
}