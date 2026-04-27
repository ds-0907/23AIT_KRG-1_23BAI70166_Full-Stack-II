package com.example.ques2.repository;

import com.example.ques2.model.Appointment;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("SELECT a FROM Appointment a WHERE LOWER(a.doctorName) = LOWER(:doctorName)")
    List<Appointment> findByDoctorNameIgnoreCase(@Param("doctorName") String doctorName);
}