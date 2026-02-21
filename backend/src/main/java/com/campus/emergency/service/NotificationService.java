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
import com.campus.emergency.model.Incident;
import com.campus.emergency.model.User;
import com.campus.emergency.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    @Value("${expo.push.url}")
    private String expoPushUrl;

    public void broadcastAlert(Incident incident) {
        AlertMessage alert = new AlertMessage(incident.getId(), incident.getCategory(), incident.getSeverity(), incident.getDescription());
        messagingTemplate.convertAndSend("/topic/alerts", alert);
        messagingTemplate.convertAndSend("/topic/incidents", IncidentResponse.fromEntity(incident));
    }

    public void sendPushNotifications(Incident incident) {
        List<User> users = userRepository.findAll();
        List<String> tokens = users.stream()
                .map(User::getPushNotificationToken)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        RestTemplate restTemplate = new RestTemplate();
        for (String token : tokens) {
            Map<String, Object> pushRequest = new HashMap<>();
            pushRequest.put("to", token);
            pushRequest.put("title", "🚨 EMERGENCY ALERT: " + incident.getCategory());
            pushRequest.put("body", incident.getDescription());
            pushRequest.put("data", Map.of("incidentId", incident.getId()));
            pushRequest.put("sound", "default");

            restTemplate.postForEntity(expoPushUrl, pushRequest, String.class);
        }
    }
}