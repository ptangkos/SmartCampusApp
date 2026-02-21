package com.campus.emergency.dto;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank
    private String spireId;
    @NotBlank
    private String password;
}