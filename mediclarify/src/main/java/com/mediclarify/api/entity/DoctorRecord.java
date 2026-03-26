package com.mediclarify.api.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "doctor_records")
public class DoctorRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private UUID patientId;
    
    @Column(columnDefinition = "TEXT")
    private String rawTranscription;

    // --- NEW: Added to match the UML "Simplifying" state ---
    @Column(columnDefinition = "TEXT")
    private String simplifiedText;

    @Column(name = "raw_audio_url")
    private String rawAudioUrl;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public UUID getPatientId() { return patientId; }
    public void setPatientId(UUID patientId) { this.patientId = patientId; }
    public String getRawTranscription() { return rawTranscription; }
    public void setRawTranscription(String rawTranscription) { this.rawTranscription = rawTranscription; }
    public String getSimplifiedText() { return simplifiedText; }
    public void setSimplifiedText(String simplifiedText) { this.simplifiedText = simplifiedText; }
    public String getRawAudioUrl() {
        return rawAudioUrl;
    }

    public void setRawAudioUrl(String rawAudioUrl) {
        this.rawAudioUrl = rawAudioUrl;
    }
}