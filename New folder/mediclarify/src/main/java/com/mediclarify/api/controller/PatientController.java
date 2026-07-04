package com.mediclarify.api.controller;

import com.mediclarify.api.dto.PatientRegistrationRequest;
import com.mediclarify.api.entity.Patient;
import com.mediclarify.api.repository.PatientRepository;
import com.mediclarify.api.service.PatientRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/patients")
public class PatientController {
    @Autowired
    private PatientRegistrationService patientRegistrationService;

    @Autowired
    private PatientRepository patientRepository;

    @PostMapping("/register")
    public ResponseEntity<String> registerPatient(@RequestBody PatientRegistrationRequest request) {
        try {
            patientRegistrationService.registerNewPatient(request.getPatientId(), request.getName(),
                    request.getEmail());
            return ResponseEntity.ok("Success: Patient registered!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error registering patient.");
        }
    }

    @PutMapping("/{patientId}/vitals")
    public ResponseEntity<Patient> updateVitals(
            @PathVariable UUID patientId,
            @RequestBody Patient updatedData) {
        return patientRepository.findById(patientId).map(existingPatient -> {
            existingPatient.setWeightKg(updatedData.getWeightKg());
            existingPatient.setHeightCm(updatedData.getHeightCm());
            existingPatient.setBloodType(updatedData.getBloodType());
            existingPatient.setKnownAllergies(updatedData.getKnownAllergies());
            return ResponseEntity.ok(patientRepository.save(existingPatient));
        }).orElse(ResponseEntity.notFound().build());
    }
}
