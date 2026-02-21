package com.campus.emergency.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.campus.emergency.model.Incident;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByStatusOrderByCreatedAtDesc(String status);
    List<Incident> findBySeverityOrderByCreatedAtDesc(String severity);
    List<Incident> findBySeverityInOrderByCreatedAtDesc(List<String> severities);
    List<Incident> findByCategoryOrderByCreatedAtDesc(String category);
    List<Incident> findAllByOrderByCreatedAtDesc();

    @Query("SELECT i.latitude, i.longitude, COUNT(i) FROM Incident i GROUP BY i.latitude, i.longitude")
    List<Object[]> getHeatmapData();
}