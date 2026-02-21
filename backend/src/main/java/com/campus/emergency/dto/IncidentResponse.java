package com.campus.emergency.dto;

import java.time.LocalDateTime;

import com.campus.emergency.model.Incident;

import lombok.Data;

@Data
public class IncidentResponse {
    private Long id;
    private String category;
    private String severity;
    private String description;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
    private boolean anonymous;
    private String status;
    private LocalDateTime createdAt;
    // Fix #11: Reporter info for authorities (null for anonymous or public view)
    private String reporterSpireId;
    private String reporterName;

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
        // Set image URL if image exists
        if (incident.getImage() != null) {
            dto.setImageUrl("/api/incidents/" + incident.getId() + "/image");
        }
        // Only include reporter info if not anonymous
        if (!incident.isAnonymous() && incident.getReporter() != null) {
            dto.setReporterSpireId(incident.getReporter().getSpireId());
            dto.setReporterName(incident.getReporter().getFullName());
        }
        return dto;
    }
}