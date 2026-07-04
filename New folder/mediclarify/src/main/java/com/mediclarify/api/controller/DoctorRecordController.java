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
@CrossOrigin(origins = "http://localhost:8081")
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
            if (file.isEmpty())
                return ResponseEntity.badRequest().body("No file found.");

            DoctorRecord note = new DoctorRecord();
            note.setPatientId(patientId);
            note.setRawTranscription("Transcription pending.");
            note.setSimplifiedText("Simplification pending.");
            note = doctorRecordRepository.saveAndFlush(note);

            String fullAudioUrl = null;
            try {
                String savedFilePath = supabaseStorageService.uploadAudioFile(file, patientId.toString());
                fullAudioUrl = supabaseStorageService.getPublicUrl("medical-documents", savedFilePath);
            } catch (Exception storageError) {
                storageError.printStackTrace();
                return ResponseEntity.status(502).body("Audio storage upload failed: " + storageError.getMessage());
            }

            String transcribedText = note.getRawTranscription();
            String simplifiedText = note.getSimplifiedText();

            try {
                transcribedText = aiProcessor.transcribeAudio(file.getBytes());

                simplifiedText = aiProcessor.simplifySingleTranscription(transcribedText);
            } catch (Exception aiError) {
                aiError.printStackTrace();
            }

            note.setRawAudioUrl(fullAudioUrl);
            note.setRawTranscription(transcribedText);
            note.setSimplifiedText(simplifiedText);
            DoctorRecord savedNote = doctorRecordRepository.saveAndFlush(note);
            System.out.println("Saved doctor record with id=" + savedNote.getId() + " for patientId=" + patientId);

            return ResponseEntity.ok(simplifiedText); // Upload succeeds even if AI is unavailable.
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