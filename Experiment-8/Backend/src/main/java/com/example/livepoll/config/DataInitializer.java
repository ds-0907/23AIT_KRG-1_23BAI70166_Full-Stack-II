package com.example.livepoll.config;

import com.example.livepoll.entity.ERole;
import com.example.livepoll.entity.Role;
import com.example.livepoll.entity.User;
import com.example.livepoll.repository.RoleRepository;
import com.example.livepoll.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(null, ERole.ROLE_USER));
            roleRepository.save(new Role(null, ERole.ROLE_ADMIN));
        }

        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN).get();
            Role userRole = roleRepository.findByName(ERole.ROLE_USER).get();

            User admin = User.builder()
                    .username("admin")
                    .email("admin@test.com")
                    .password(passwordEncoder.encode("admin123"))
                    .provider("local")
                    .roles(new HashSet<>(Collections.singletonList(adminRole)))
                    .build();
            userRepository.save(admin);

            User user = User.builder()
                    .username("user")
                    .email("user@test.com")
                    .password(passwordEncoder.encode("user123"))
                    .provider("local")
                    .roles(new HashSet<>(Collections.singletonList(userRole)))
                    .build();
            userRepository.save(user);
        }
    }
}
