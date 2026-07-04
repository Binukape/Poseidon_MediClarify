package com.mediclarify.api.controller;

import com.mediclarify.api.entity.DoctorRecord;
import com.mediclarify.api.repository.DoctorRecordRepository;
import com.mediclarify.api.service.AIProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports-generator")
@CrossOrigin(origins = "http://localhost:8081")
public class ReportGeneratorController {

    @Autowired
    private AIProcessor aiProcessor;

    @Autowired
    private DoctorRecordRepository doctorRecordRepository;

    @GetMapping("/generate/{patientId}")
    public ResponseEntity<String> generateReport(@PathVariable UUID patientId) {
        try {
            List<DoctorRecord> pastNotes = doctorRecordRepository.findByPatientId(patientId);

            List<String> noteTexts = pastNotes.stream()
                    .map(DoctorRecord::getRawTranscription)
                    .collect(Collectors.toList());

            String reportText = aiProcessor.generateSimplifiedReport(noteTexts);

            return ResponseEntity.ok(reportText);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to generate report.");
        }
    }
}