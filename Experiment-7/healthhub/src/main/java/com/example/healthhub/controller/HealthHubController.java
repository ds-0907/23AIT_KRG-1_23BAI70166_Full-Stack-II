package com.example.healthhub.controller;

import com.example.healthhub.model.Appointment;
import com.example.healthhub.model.Patient;
import com.example.healthhub.service.HealthHubService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/healthhub")
@RequiredArgsConstructor
public class HealthHubController {

    private final HealthHubService healthHubService;

    @GetMapping("/patients")
    public ResponseEntity<Page<Patient>> getAllPatients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy) {
        return ResponseEntity.ok(healthHubService.getPatientsPaginated(page, size, sortBy));
    }

    @GetMapping("/patients/email/{email}")
    public ResponseEntity<Patient> getPatientByEmail(@PathVariable String email) {
        return ResponseEntity.ok(healthHubService.getPatientByEmailOptimized(email));
    }

    @PostMapping("/patients")
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        return ResponseEntity.ok(healthHubService.registerPatient(patient));
    }

    @PostMapping("/patients/{id}/appointments")
    public ResponseEntity<Appointment> addAppointment(@PathVariable Long id, @RequestBody Appointment appointment) {
        return ResponseEntity.ok(healthHubService.scheduleAppointment(id, appointment));
    }

    @GetMapping("/stats")
    public ResponseEntity<List<Object[]>> getStats() {
        return ResponseEntity.ok(healthHubService.getAppointmentStatistics());
    }
}
