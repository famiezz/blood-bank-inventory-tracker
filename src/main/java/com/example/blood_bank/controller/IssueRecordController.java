package com.example.blood_bank.controller;

import com.example.blood_bank.entity.IssueRecord;
import com.example.blood_bank.service.IssueRecordService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
public class IssueRecordController {

    private final IssueRecordService issueRecordService;

    public IssueRecordController(IssueRecordService issueRecordService) {
        this.issueRecordService = issueRecordService;
    }

    @PostMapping
    public IssueRecord saveIssue(@Valid @RequestBody IssueRecord issueRecord) {
        return issueRecordService.issueBlood(issueRecord);
    }

    @GetMapping
    public List<IssueRecord> getAllIssues() {
        return issueRecordService.getAllIssues();
    }
}