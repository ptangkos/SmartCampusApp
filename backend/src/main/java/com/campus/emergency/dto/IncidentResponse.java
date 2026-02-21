package com.campus.emergency.dto;

import java.time.LocalDateTime;

import lombok.Data;
import main.java.com.campus.emergency.model.Incident;

@Data
public class IncidentResponse {
    private Long id;
    private String category;
    private String severity;
    private String description;
    private Double latitude;
    private Double longitude;
    private boolean anonymous;
    private String status;
    private LocalDateTime createdAt;

    public static IncidentResponse fromEntity(Incident incident) {
        IncidentResponse dto = new IncidentResponse();
        dto.setId(incident.getId());
        dto.setCategory(incident.getCategory());
        dto.setSeverity(incident.getSeverity());
        dto.setDescription(incident.getDescription());
        dto.setLatitude(incident.getLatitude());
        dto.setLongitude(incident.getLongitude());
        dto.setAnonymous(incident.isAnonymous());
        dto.setStatus(incident.getStatus());
        dto.setCreatedAt(incident.getCreatedAt());
        return dto;
    }
}