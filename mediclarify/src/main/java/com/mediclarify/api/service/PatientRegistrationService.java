package com.mediclarify.api.service;

import com.mediclarify.api.entity.Patient;
import com.mediclarify.api.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class PatientRegistrationService {
    @Autowired
    private PatientRepository patientRepository;

    public void registerNewPatient(UUID id, String name, String email) {
        Patient newPatient = new Patient();
        newPatient.setPatientId(id);
        newPatient.setName(name);
        newPatient.setEmail(email);
        patientRepository.save(newPatient);
    }
}