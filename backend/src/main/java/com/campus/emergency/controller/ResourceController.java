package com.campus.emergency.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class ResourceController {
    @GetMapping
    public List<EmergencyResource> getResources() {
        return Arrays.asList(
            new EmergencyResource("UMPD", "911", "University Police"),
            new EmergencyResource("Suicide Hotline", "988", "24/7 Crisis Support"),
            new EmergencyResource("SASA", "555-1234", "Sexual Assault Services"),
            new EmergencyResource("Counseling Center", "555-5678", "Mental Health Support")
        );
    }

    // Fix #1: Replaced record with regular class for Java 11 compatibility
    public static class EmergencyResource {
        private String name;
        private String number;
        private String description;

        public EmergencyResource(String name, String number, String description) {
            this.name = name;
            this.number = number;
            this.description = description;
        }

        public String getName() { return name; }
        public String getNumber() { return number; }
        public String getDescription() { return description; }
    }
}