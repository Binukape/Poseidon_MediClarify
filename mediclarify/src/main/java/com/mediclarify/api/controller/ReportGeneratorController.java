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
@CrossOrigin(origins = "http://localhost:3000")
public class ReportGeneratorController {

    @Autowired
    private AIProcessor aiProcessor;

    @Autowired
    private DoctorRecordRepository doctorRecordRepository;

    @GetMapping("/generate/{patientId}")
    public ResponseEntity<String> generateReport(@PathVariable UUID patientId) {
        try {
            // 1. Fetch ALL past notes from the database for this specific patient
            List<DoctorRecord> pastNotes = doctorRecordRepository.findByPatientId(patientId);
            
            // Extract just the text strings from the Entity objects
            List<String> noteTexts = pastNotes.stream()
                                              .map(DoctorRecord::getRawTranscription)
                                              .collect(Collectors.toList());

            // 2. Send the real notes to the AI
            String reportText = aiProcessor.generateSimplifiedReport(noteTexts);
            
            return ResponseEntity.ok(reportText);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to generate report.");
        }
    }
}