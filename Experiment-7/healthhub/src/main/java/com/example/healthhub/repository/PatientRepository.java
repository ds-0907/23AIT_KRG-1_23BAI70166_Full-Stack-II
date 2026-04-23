package com.example.healthhub.repository;

import com.example.healthhub.model.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    // Advanced JPQL Query with JOIN FETCH to solve the N+1 problem
    // This loads the patient and all their appointments in a single SQL query
    @Query("SELECT p FROM Patient p LEFT JOIN FETCH p.appointments WHERE p.email = :email")
    Optional<Patient> findByEmailWithAppointments(@Param("email") String email);

    // Pagination support for large datasets
    Page<Patient> findByNameContainingIgnoreCase(String name, Pageable pageable);

    // Custom query to find patients with specific appointment status
    @Query("SELECT DISTINCT p FROM Patient p JOIN p.appointments a WHERE a.status = :status")
    Page<Patient> findPatientsByAppointmentStatus(@Param("status") String status, Pageable pageable);
}
