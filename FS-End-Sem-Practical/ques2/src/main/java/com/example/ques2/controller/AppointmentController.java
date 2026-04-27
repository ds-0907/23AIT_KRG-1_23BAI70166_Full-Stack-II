package com.example.ques2.controller;

import com.example.ques2.model.Appointment;
import com.example.ques2.repository.AppointmentRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentRepository repository;

    public AppointmentController(AppointmentRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/search")
    public List<Appointment> searchAppointments(@RequestParam String doctor) {
        return repository.findByDoctorNameIgnoreCase(doctor);
    }
}