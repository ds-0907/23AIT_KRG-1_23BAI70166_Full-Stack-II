package com.example.healthhub.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "patients", indexes = {
    @Index(name = "idx_patient_name", columnList = "name"),
    @Index(name = "idx_patient_email", columnList = "email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;

    // One-to-Many relationship with Appointments
    // mappedBy indicates the inverse side (Appointment.patient)
    // cascade = ALL ensures child entities are saved/updated with parent
    // fetch = LAZY is default for @OneToMany, improves performance for large collections
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Appointment> appointments = new ArrayList<>();

    public void addAppointment(Appointment appointment) {
        appointments.add(appointment);
        appointment.setPatient(this);
    }
}
