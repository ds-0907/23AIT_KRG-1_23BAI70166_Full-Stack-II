package com.experiment9.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class TestController {

    // ==============================
    // Public endpoint – No auth required
    // ==============================
    @GetMapping("/public/health")
    public Map<String, String> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Secure Full Stack System is running!");
        return response;
    }

    // ==============================
    // USER-role protected endpoint
    // ==============================
    @GetMapping("/user/dashboard")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public Map<String, String> userDashboard() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Welcome to the User Dashboard!");
        response.put("access", "USER, MODERATOR, ADMIN");
        return response;
    }

    // ==============================
    // MODERATOR-role protected endpoint
    // ==============================
    @GetMapping("/moderator/panel")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public Map<String, String> moderatorPanel() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Welcome to the Moderator Panel!");
        response.put("access", "MODERATOR, ADMIN");
        return response;
    }

    // ==============================
    // ADMIN-role protected endpoint
    // ==============================
    @GetMapping("/admin/console")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, String> adminConsole() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Welcome to the Admin Console!");
        response.put("access", "ADMIN only");
        return response;
    }
}
