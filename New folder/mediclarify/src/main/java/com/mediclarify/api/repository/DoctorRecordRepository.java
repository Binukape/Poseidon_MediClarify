package com.mediclarify.api.repository;

import com.mediclarify.api.entity.DoctorRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface DoctorRecordRepository extends JpaRepository<DoctorRecord, Long> {
    List<DoctorRecord> findByPatientId(UUID patientId);
}