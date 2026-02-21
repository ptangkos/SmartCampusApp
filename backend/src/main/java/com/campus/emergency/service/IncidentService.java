package com.campus.emergency.service;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.campus.emergency.dto.IncidentRequest;
import com.campus.emergency.dto.IncidentResponse;
import com.campus.emergency.model.Incident;
import com.campus.emergency.model.User;
import com.campus.emergency.repository.IncidentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IncidentService {
    private final IncidentRepository incidentRepository;
    private final SeverityClassifier severityClassifier;

    public Incident createIncident(IncidentRequest request, MultipartFile image, User reporter) {
        Incident incident = new Incident();
        incident.setReporter(reporter);
        incident.setCategory(request.getCategory());
        incident.setDescription(request.getDescription());
        incident.setLatitude(request.getLatitude());
        incident.setLongitude(request.getLongitude());
        incident.setAnonymous(request.isAnonymous());

        String severity = severityClassifier.classify(request.getCategory(), request.getDescription());
        incident.setSeverity(severity);

        if (image != null && !image.isEmpty()) {
            try {
                incident.setImage(image.getBytes());
            } catch (IOException e) {
                throw new RuntimeException("Failed to store image", e);
            }
        }

        incident.setStatus("OPEN");
        return incidentRepository.save(incident);
    }

    // Fix #12: Actually apply filters
    public List<IncidentResponse> getFilteredIncidents(String category, String severity, String status) {
        List<Incident> incidents;

        if (status != null) {
            incidents = incidentRepository.findByStatusOrderByCreatedAtDesc(status);
        } else if (severity != null) {
            incidents = incidentRepository.findBySeverityOrderByCreatedAtDesc(severity);
        } else if (category != null) {
            incidents = incidentRepository.findByCategoryOrderByCreatedAtDesc(category);
        } else {
            incidents = incidentRepository.findAllByOrderByCreatedAtDesc();
        }

        return incidents.stream()
                .map(IncidentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Fix #14: Get single incident by ID
    public Optional<IncidentResponse> getIncidentById(Long id) {
        return incidentRepository.findById(id)
                .map(IncidentResponse::fromEntity);
    }

    // Fix #13: Get incident image
    public byte[] getIncidentImage(Long id) {
        return incidentRepository.findById(id)
                .map(Incident::getImage)
                .orElse(null);
    }

    // Fix #9: Update incident status
    public Optional<IncidentResponse> updateIncidentStatus(Long id, String newStatus) {
        return incidentRepository.findById(id)
                .map(incident -> {
                    incident.setStatus(newStatus);
                    Incident saved = incidentRepository.save(incident);
                    return IncidentResponse.fromEntity(saved);
                });
    }

    public Map<String, List<IncidentResponse>> getGroupedFeed() {
        List<Incident> critical = incidentRepository.findBySeverityOrderByCreatedAtDesc("CRITICAL");
        List<Incident> highMedium = incidentRepository.findBySeverityInOrderByCreatedAtDesc(Arrays.asList("HIGH", "MEDIUM"));
        List<Incident> low = incidentRepository.findBySeverityOrderByCreatedAtDesc("LOW");

        Map<String, List<IncidentResponse>> feed = new HashMap<>();
        feed.put("critical", critical.stream().map(IncidentResponse::fromEntity).collect(Collectors.toList()));
        feed.put("highMedium", highMedium.stream().map(IncidentResponse::fromEntity).collect(Collectors.toList()));
        feed.put("low", low.stream().map(IncidentResponse::fromEntity).collect(Collectors.toList()));
        return feed;
    }

    public List<Object[]> getHeatmapData() {
        return incidentRepository.getHeatmapData();
    }
}