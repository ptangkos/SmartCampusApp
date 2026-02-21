package com.campus.emergency.dto;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String spireId;
    @NotBlank
    private String fullName;
    @NotBlank
    private String password;
    private String role; // default STUDENT
}