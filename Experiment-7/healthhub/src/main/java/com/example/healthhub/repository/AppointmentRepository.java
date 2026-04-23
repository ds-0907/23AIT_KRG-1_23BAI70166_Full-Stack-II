package com.example.healthhub.repository;

import com.example.healthhub.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Query between dates using JPQL
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :start AND :end")
    List<Appointment> findAppointmentsInDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // Count appointments per status
    @Query("SELECT a.status, COUNT(a) FROM Appointment a GROUP BY a.status")
    List<Object[]> countAppointmentsByStatus();
}
