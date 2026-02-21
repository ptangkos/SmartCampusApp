package com.campus.emergency.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.emergency.model.Alert;

public interface AlertRepository extends JpaRepository<Alert, Long> {
}