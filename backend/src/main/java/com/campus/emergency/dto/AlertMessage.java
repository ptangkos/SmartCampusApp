package com.campus.emergency.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AlertMessage {
    private Long incidentId;
    private String category;
    private String severity;
    private String description;
}