package com.campus.emergency.model;

import java.time.LocalDateTime;

import javax.persistence.*;

import org.hibernate.annotations.CreationTimestamp;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String spireId;

    private String fullName;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String pushNotificationToken;

    @CreationTimestamp
    private LocalDateTime createdAt;
}