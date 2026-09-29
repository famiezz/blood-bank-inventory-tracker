package com.example.blood_bank.service;

import com.example.blood_bank.entity.BloodUnit;
import com.example.blood_bank.entity.IssueRecord;
import com.example.blood_bank.repository.BloodUnitRepository;
import com.example.blood_bank.repository.IssueRecordRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class IssueRecordService {

    private final IssueRecordRepository issueRecordRepository;
    private final BloodUnitRepository bloodUnitRepository;

    public IssueRecordService(IssueRecordRepository issueRecordRepository,
                              BloodUnitRepository bloodUnitRepository) {
        this.issueRecordRepository = issueRecordRepository;
        this.bloodUnitRepository = bloodUnitRepository;
    }

    public IssueRecord issueBlood(IssueRecord issueRecord) {

        String bloodGroup = issueRecord.getBloodGroup();
        int unitsRequired = issueRecord.getUnitsIssued();

        LocalDate today = LocalDate.now();

        List<BloodUnit> allUnits = bloodUnitRepository.findAll();

        int availableUnits = 0;

        for (BloodUnit unit : allUnits) {

            if (unit.getBloodGroup().equals(bloodGroup)
                    && "AVAILABLE".equals(unit.getStatus())
                    && unit.getExpiryDate() != null
                    && !unit.getExpiryDate().isBefore(today)) {

                availableUnits++;
            }
        }

        if (availableUnits < unitsRequired) {
            throw new RuntimeException(
                    "Insufficient blood stock for " + bloodGroup
            );
        }

        int issuedCount = 0;

        for (BloodUnit unit : allUnits) {

            if (unit.getBloodGroup().equals(bloodGroup)
                    && "AVAILABLE".equals(unit.getStatus())
                    && unit.getExpiryDate() != null
                    && !unit.getExpiryDate().isBefore(today)) {

                unit.setStatus("ISSUED");

                bloodUnitRepository.save(unit);

                issuedCount++;

                if (issuedCount == unitsRequired) {
                    break;
                }
            }
        }

        issueRecord.setIssueDate(today);

        return issueRecordRepository.save(issueRecord);
    }

    public List<IssueRecord> getAllIssues() {
        return issueRecordRepository.findAll();
    }
}