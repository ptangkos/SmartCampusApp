package com.campus.emergency.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.campus.emergency.dto.CommentRequest;
import com.campus.emergency.dto.CommentResponse;
import com.campus.emergency.dto.IncidentRequest;
import com.campus.emergency.dto.IncidentResponse;
import com.campus.emergency.model.Comment;
import com.campus.emergency.model.Incident;
import com.campus.emergency.model.User;
import com.campus.emergency.repository.CommentRepository;
import com.campus.emergency.repository.IncidentRepository;
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
    private final CommentRepository commentRepository;
    private final IncidentRepository incidentRepository;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
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
    @Transactional(readOnly = true)
    public ResponseEntity<IncidentResponse> getIncidentById(@PathVariable Long id) {
        return incidentService.getIncidentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/image")
    @Transactional(readOnly = true)
    public ResponseEntity<byte[]> getIncidentImage(@PathVariable Long id) {
        byte[] image = incidentService.getIncidentImage(id);
        if (image == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(image);
    }

    @GetMapping("/{id}/comments")
    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(@PathVariable Long id) {
        return commentRepository.findByIncidentIdOrderByCreatedAtDesc(id)
                .stream()
                .map(CommentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @PostMapping("/{id}/comments")
    @Transactional
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long id,
            @RequestBody CommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        return incidentRepository.findById(id).map(incident -> {
            Comment comment = new Comment();
            comment.setIncident(incident);
            comment.setContent(request.getContent());
            comment.setAnonymous(request.isAnonymous());

            if (userDetails != null && !request.isAnonymous()) {
                User user = userService.findBySpireId(userDetails.getUsername());
                comment.setUser(user);
                comment.setAuthorName(user.getFullName());
            } else if (!request.isAnonymous() && request.getAuthorName() != null) {
                comment.setAuthorName(request.getAuthorName());
            } else {
                comment.setAuthorName("Anonymous");
            }

            Comment saved = commentRepository.save(comment);
            return ResponseEntity.ok(CommentResponse.fromEntity(saved));
        }).orElse(ResponseEntity.notFound().build());
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
