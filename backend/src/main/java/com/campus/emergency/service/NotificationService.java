package com.campus.emergency.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.campus.emergency.dto.AlertMessage;
import com.campus.emergency.dto.IncidentResponse;
import com.campus.emergency.model.Alert;
import com.campus.emergency.model.Incident;
import com.campus.emergency.model.User;
import com.campus.emergency.repository.AlertRepository;
import com.campus.emergency.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final AlertRepository alertRepository;

    @Value("${expo.push.url}")
    private String expoPushUrl;

    public void broadcastAlert(Incident incident) {
        AlertMessage alertMsg = new AlertMessage(
                incident.getId(),
                incident.getCategory(),
                incident.getSeverity(),
                incident.getDescription()
        );
        messagingTemplate.convertAndSend("/topic/alerts", alertMsg);
        messagingTemplate.convertAndSend("/topic/incidents", IncidentResponse.fromEntity(incident));

        // Fix #16: Persist alert to database
        Alert alert = new Alert();
        alert.setIncident(incident);
        alert.setAlertType("EMERGENCY");
        alert.setMessage("EMERGENCY ALERT: " + incident.getCategory() + " - " + incident.getDescription());
        alertRepository.save(alert);
    }

    public void sendPushNotifications(Incident incident) {
        List<User> users = userRepository.findAll();
        List<String> tokens = users.stream()
                .map(User::getPushNotificationToken)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        RestTemplate restTemplate = new RestTemplate();
        for (String token : tokens) {
            // Fix #15: Try-catch per token so one failure doesn't stop all notifications
            try {
                Map<String, Object> pushRequest = new HashMap<>();
                pushRequest.put("to", token);
                pushRequest.put("title", "EMERGENCY ALERT: " + incident.getCategory());
                pushRequest.put("body", incident.getDescription());
                pushRequest.put("data", Map.of("incidentId", incident.getId()));
                pushRequest.put("sound", "default");

                restTemplate.postForEntity(expoPushUrl, pushRequest, String.class);
            } catch (Exception e) {
                log.error("Failed to send push notification to token {}: {}", token, e.getMessage());
            }
        }
    }
}