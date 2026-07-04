package com.mediclarify.api.dto;

import java.util.UUID; // Add this import!

public class PatientRegistrationRequest {
    private UUID patientId; // Changed to UUID
    private String name;
    private String email;

    public UUID getPatientId() { return patientId; }
    public void setPatientId(UUID patientId) { this.patientId = patientId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}