package com.example.healthhub.service;

import com.example.healthhub.model.Appointment;
import com.example.healthhub.model.Patient;
import com.example.healthhub.repository.AppointmentRepository;
import com.example.healthhub.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class HealthHubService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    @Transactional(readOnly = true)
    public Page<Patient> getPatientsPaginated(int page, int size, String sortBy) {
        log.info("Fetching patients page {} with size {} sorted by {}", page, size, sortBy);
        return patientRepository.findAll(PageRequest.of(page, size, Sort.by(sortBy)));
    }

    @Transactional(readOnly = true)
    public Patient getPatientByEmailOptimized(String email) {
        // Using the JOIN FETCH query to prevent N+1 issues when accessing appointments later
        return patientRepository.findByEmailWithAppointments(email)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    @Transactional
    public Patient registerPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    @Transactional
    public Appointment scheduleAppointment(Long patientId, Appointment appointment) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        patient.addAppointment(appointment);
        return appointmentRepository.save(appointment);
    }

    @Transactional(readOnly = true)
    public List<Object[]> getAppointmentStatistics() {
        return appointmentRepository.countAppointmentsByStatus();
    }
}
