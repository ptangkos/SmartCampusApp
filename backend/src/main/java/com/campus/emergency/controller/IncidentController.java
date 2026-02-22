package com.campus.emergency.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.campus.emergency.dto.IncidentRequest;
import com.campus.emergency.dto.IncidentResponse;
import com.campus.emergency.model.Incident;
import com.campus.emergency.model.User;
import com.campus.emergency.service.IncidentService;
import com.campus.emergency.service.NotificationService;
import com.campus.emergency.service.UserService;
import com.campus.emergency.utils.ImageValidator;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {
    private final IncidentService incidentService;
    private final NotificationService notificationService;
    private final UserService userService;
    private final ObjectMapper objectMapper;

    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<IncidentResponse> createIncident(
            @RequestPart("data") String dataJson,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails userDetails) {

        IncidentRequest request;
        try {
            request = objectMapper.readValue(dataJson, IncidentRequest.class);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

        if (image != null && !ImageValidator.isFromCamera(image)) {
            return ResponseEntity.badRequest().build();
        }

        User reporter = userDetails != null ? userService.findBySpireId(userDetails.getUsername()) : null;
        Incident incident = incidentService.createIncident(request, image, reporter);

        if ("CRITICAL".equals(incident.getSeverity())) {
            notificationService.broadcastAlert(incident);
            notificationService.sendPushNotifications(incident);
        }

        return ResponseEntity.ok(IncidentResponse.fromEntity(incident));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponse> getIncidentById(@PathVariable Long id) {
        return incidentService.getIncidentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<IncidentResponse> getIncidents(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String status) {
        return incidentService.getFilteredIncidents(category, severity, status);
    }

    @GetMapping("/feed")
    public Map<String, List<IncidentResponse>> getFeed() {
        return incidentService.getGroupedFeed();
    }

    @GetMapping("/heatmap")
    public List<Object[]> getHeatmap() {
        return incidentService.getHeatmapData();
    }
}