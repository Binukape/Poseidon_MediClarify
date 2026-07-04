package com.mediclarify.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mediclarify.api.entity.Patient;
import com.mediclarify.api.repository.PatientRepository;
import com.mediclarify.api.service.PatientRegistrationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PatientController.class)
class PatientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PatientRegistrationService patientRegistrationService;

    @MockBean
    private PatientRepository patientRepository;

    @Test
    void shouldReturnPatientVitalsWhenFetched() throws Exception {
        UUID patientId = UUID.randomUUID();
        Patient patient = new Patient();
        patient.setPatientId(patientId);
        patient.setWeightKg(72.5);
        patient.setHeightCm(170.0);
        patient.setBloodType("O+");
        patient.setKnownAllergies("Penicillin");

        when(patientRepository.findById(patientId)).thenReturn(Optional.of(patient));

        mockMvc.perform(get("/api/patients/{patientId}", patientId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.weightKg").value(72.5))
                .andExpect(jsonPath("$.bloodType").value("O+"));
    }

    @Test
    void shouldUpdatePatientVitals() throws Exception {
        UUID patientId = UUID.randomUUID();
        Patient existingPatient = new Patient();
        existingPatient.setPatientId(patientId);

        when(patientRepository.findById(patientId)).thenReturn(Optional.of(existingPatient));
        when(patientRepository.save(any(Patient.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String payload = "{\"weightKg\":72,\"heightCm\":168,\"bloodType\":\"O+\",\"knownAllergies\":\"Penicillin\"}";

        mockMvc.perform(put("/api/patients/{patientId}/vitals", patientId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.weightKg").value(72))
                .andExpect(jsonPath("$.bloodType").value("O+"));
    }
}
