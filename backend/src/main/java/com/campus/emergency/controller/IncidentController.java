package com.campus.emergency.controller;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.campus.emergency.service.IncidentService;
import com.campus.emergency.service.NotificationService;
import com.campus.emergency.service.UserService;

import lombok.RequiredArgsConstructor;
import main.java.com.campus.emergency.dto.IncidentRequest;
import main.java.com.campus.emergency.dto.IncidentResponse;
import main.java.com.campus.emergency.model.Incident;
import main.java.com.campus.emergency.model.User;
import main.java.com.campus.emergency.utils.ImageValidator;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {
    private final IncidentService incidentService;
    private final NotificationService notificationService;
    private final UserService userService;

    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<IncidentResponse> createIncident(
            @RequestPart("data") @Valid IncidentRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails userDetails) {

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