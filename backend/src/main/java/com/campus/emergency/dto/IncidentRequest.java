package com.campus.emergency.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.Data;

@Data
public class IncidentRequest {
    @NotBlank
    private String category;
    private String description;
    @NotNull
    private Double latitude;
    @NotNull
    private Double longitude;
    private boolean anonymous;
}