package com.mediclarify.api.repository;

import com.mediclarify.api.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID; // Add this import!

// Changed String to UUID here:
@Repository
public interface PatientRepository extends JpaRepository<Patient, UUID> {
}