package com.campus.emergency.controller;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class IncidentController {
    private final IncidentService incidentService;
    private final NotificationService notificationService;
    private final UserService userService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<IncidentResponse> createIncident(
            @RequestPart("data") @Valid IncidentRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (image != null && !ImageValidator.isFromCamera(image)) {
            return ResponseEntity.badRequest().build();
        }

        User reporter = null;
        if (userDetails != null) {
            try {
                reporter = userService.findBySpireId(userDetails.getUsername());
            } catch (Exception e) {
                // Anonymous user, reporter stays null
            }
        }

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

    // Fix #14: Add single incident detail endpoint
    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponse> getIncidentById(@PathVariable Long id) {
        return incidentService.getIncidentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Fix #13: Add image retrieval endpoint
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getIncidentImage(@PathVariable Long id) {
        byte[] image = incidentService.getIncidentImage(id);
        if (image == null) {
            return ResponseEntity.notFound().build();
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG);
        return new ResponseEntity<>(image, headers, HttpStatus.OK);
    }

    @GetMapping("/feed")
    public Map<String, List<IncidentResponse>> getFeed() {
        return incidentService.getGroupedFeed();
    }

    @GetMapping("/heatmap")
    public List<Object[]> getHeatmap() {
        return incidentService.getHeatmapData();
    }

    // Fix #9: Add PATCH endpoint for incident status updates
    @PatchMapping("/{id}/status")
    public ResponseEntity<IncidentResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        if (newStatus == null) {
            return ResponseEntity.badRequest().build();
        }
        return incidentService.updateIncidentStatus(id, newStatus)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}