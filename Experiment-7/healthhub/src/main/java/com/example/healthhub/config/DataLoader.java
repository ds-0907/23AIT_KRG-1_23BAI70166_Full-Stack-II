package com.example.healthhub.config;

import com.example.healthhub.model.Appointment;
import com.example.healthhub.model.Patient;
import com.example.healthhub.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final PatientRepository patientRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("Seeding data for HealthHub Experiment 7...");

        List<Patient> patients = new ArrayList<>();
        for (int i = 1; i <= 50; i++) {
            Patient p = Patient.builder()
                    .name("Patient " + i)
                    .email("patient" + i + "@example.com")
                    .phone("555-010" + i)
                    .appointments(new ArrayList<>())
                    .build();

            // Add some appointments for each patient to demonstrate One-to-Many
            for (int j = 1; j <= 3; j++) {
                Appointment a = Appointment.builder()
                        .appointmentDate(LocalDateTime.now().plusDays(j))
                        .reason("Checkup " + j)
                        .status(j % 2 == 0 ? "COMPLETED" : "SCHEDULED")
                        .patient(p)
                        .build();
                p.getAppointments().add(a);
            }
            patients.add(p);
        }

        // Save all will use batching if configured in application.properties
        patientRepository.saveAll(patients);

        log.info("Successfully seeded 50 patients and 150 appointments.");
    }
}
