package com.mediclarify.api.controller;

import com.mediclarify.api.entity.DoctorRecord;
import com.mediclarify.api.repository.DoctorRecordRepository;
import com.mediclarify.api.service.AIProcessor;
import com.mediclarify.api.service.SupabaseStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/doctor-records")
@CrossOrigin(origins = "http://localhost:3000")
public class DoctorRecordController {

    @Autowired
    private SupabaseStorageService supabaseStorageService;

    @Autowired
    private AIProcessor aiProcessor;

    @Autowired
    private DoctorRecordRepository doctorRecordRepository;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadAudioRecord(
            @RequestParam("audioFile") MultipartFile file,
            @RequestParam("patientId") UUID patientId) {
        try {
            if (file.isEmpty()) return ResponseEntity.badRequest().body("No file found.");

            // UML State: RawAudioSaved
            String savedFilePath = supabaseStorageService.uploadAudioFile(file, patientId.toString());
            String fullAudioUrl = supabaseStorageService.getPublicUrl("medical-documents", savedFilePath);

            // UML State: Transcribing
            String transcribedText = aiProcessor.transcribeAudio(file.getBytes());

            // UML State: Simplifying (THE NEW STEP!)
            String simplifiedText = aiProcessor.simplifySingleTranscription(transcribedText);

            // UML State: Completed (Record finalized for database)
            DoctorRecord note = new DoctorRecord();
            note.setPatientId(patientId);
            note.setRawAudioUrl(fullAudioUrl); // Link the raw audio full URL
            note.setRawTranscription(transcribedText);
            note.setSimplifiedText(simplifiedText); // Saving the simplified version!
            doctorRecordRepository.save(note);

            return ResponseEntity.ok(simplifiedText); // Hand the actual AI text back to the frontend!
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error processing file.");
        }
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<DoctorRecord>> getPatientConsultations(@PathVariable UUID patientId) {
        List<DoctorRecord> records = doctorRecordRepository.findByPatientId(patientId);
        return ResponseEntity.ok(records);
    }
}