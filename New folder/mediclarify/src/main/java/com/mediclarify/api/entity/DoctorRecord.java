package com.mediclarify.api.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctor_records")
public class DoctorRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID patientId;

    @Column(columnDefinition = "TEXT")
    private String rawTranscription;

    @Column(columnDefinition = "TEXT")
    private String simplifiedText;

    @Column(name = "raw_audio_url")
    @JsonProperty("audioUrl")
    private String rawAudioUrl;

    @Column(name = "created_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UUID getPatientId() {
        return patientId;
    }

    public void setPatientId(UUID patientId) {
        this.patientId = patientId;
    }

    public String getRawTranscription() {
        return rawTranscription;
    }

    public void setRawTranscription(String rawTranscription) {
        this.rawTranscription = rawTranscription;
    }

    public String getSimplifiedText() {
        return simplifiedText;
    }

    public void setSimplifiedText(String simplifiedText) {
        this.simplifiedText = simplifiedText;
    }

    public String getRawAudioUrl() {
        return rawAudioUrl;
    }

    @JsonIgnore
    public String getAudioUrl() {
        return rawAudioUrl;
    }

    public void setRawAudioUrl(String rawAudioUrl) {
        this.rawAudioUrl = rawAudioUrl;
    }

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getKeyInstructions() {
        if (simplifiedText == null || simplifiedText.isBlank()) {
            return null;
        }

        String marker = "### Key Instructions";
        int markerIndex = simplifiedText.indexOf(marker);
        if (markerIndex < 0) {
            return null;
        }

        return simplifiedText.substring(markerIndex + marker.length()).trim();
    }
}