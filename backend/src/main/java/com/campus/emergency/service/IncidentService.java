package com.campus.emergency.service;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

    public List<IncidentResponse> getFilteredIncidents(String category, String severity, String status) {
        return incidentRepository.findAll().stream()
                .map(IncidentResponse::fromEntity)
                .collect(Collectors.toList());
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