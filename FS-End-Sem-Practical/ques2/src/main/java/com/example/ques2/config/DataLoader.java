package com.example.ques2.config;

import com.example.ques2.model.Appointment;
import com.example.ques2.repository.AppointmentRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.CommandLineRunner;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadData(AppointmentRepository repo) {
        return args -> {
            repo.save(new Appointment("Smith", "John"));
            repo.save(new Appointment("SMITH", "Alice"));
            repo.save(new Appointment("Brown", "David"));
        };
    }
}