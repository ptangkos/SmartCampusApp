package com.campus.emergency.model;

import java.time.LocalDateTime;

import javax.persistence.*;

import org.hibernate.annotations.CreationTimestamp;

import lombok.Data;

@Entity
@Data
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Incident incident;

    private String alertType; // EMERGENCY, NON_EMERGENCY
    private String message;

    @CreationTimestamp
    private LocalDateTime sentAt;
}