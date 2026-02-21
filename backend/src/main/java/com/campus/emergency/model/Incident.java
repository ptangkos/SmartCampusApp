package com.campus.emergency.model;

import java.time.LocalDateTime;

import javax.persistence.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reporter_id")
    private User reporter;

    private String category; // ICE, SHOOTING, FIRE, MENTAL_HEALTH, etc.
    private String severity; // CRITICAL, HIGH, MEDIUM, LOW
    private String description;

    @Lob
    private byte[] image;

    private Double latitude;
    private Double longitude;
    private boolean isAnonymous;
    private String status; // OPEN, RESPONDING, RESOLVED

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}