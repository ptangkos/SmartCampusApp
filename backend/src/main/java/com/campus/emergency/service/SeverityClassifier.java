package com.campus.emergency.service;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class SeverityClassifier {
    public String classify(String category, String description) {
        if (List.of("ICE", "SHOOTING", "FIRE").contains(category)) {
            return "CRITICAL";
        } else if ("MEDICAL".equals(category)) {
            return "HIGH";
        } else {
            return "MEDIUM";
        }
    }
}