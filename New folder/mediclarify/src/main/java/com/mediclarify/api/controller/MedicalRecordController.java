package com.mediclarify.api.controller;

import com.mediclarify.api.entity.MedicalRecord;
import com.mediclarify.api.repository.MedicalRecordRepository;
import com.mediclarify.api.service.SupabaseStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping({ "/api/documents", "/api/medical-records" })
@CrossOrigin(origins = "http://localhost:8081")
public class MedicalRecordController {

    @Autowired
    private SupabaseStorageService supabaseStorageService;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("patientId") UUID patientId) {
        try {
            if (file.isEmpty())
                return ResponseEntity.badRequest().body("File is empty.");

            String contentType = file.getContentType();
            if (contentType == null || (!contentType.equals("application/pdf") && !contentType.startsWith("image/"))) {
                return ResponseEntity.badRequest().body("Invalid format. Only PDF and Images allowed.");
            }

            String storedPath = supabaseStorageService.uploadDocumentFile(file, patientId.toString());

            MedicalRecord record = new MedicalRecord();
            record.setPatientId(patientId);
            record.setFileName(file.getOriginalFilename());
            record.setFilePath(supabaseStorageService.getPublicUrl("medical-documents", storedPath));
            medicalRecordRepository.save(record);

            return ResponseEntity.ok("Document stored securely: " + record.getFilePath());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error uploading document.");
        }
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<String>> getPatientDocuments(@PathVariable UUID patientId) {
        try {
            List<String> documents = supabaseStorageService.listPatientDocuments(patientId.toString());
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}