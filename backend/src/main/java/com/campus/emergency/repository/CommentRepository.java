package com.campus.emergency.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.campus.emergency.model.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("SELECT c FROM Comment c WHERE c.incident.id = :incidentId ORDER BY c.createdAt DESC")
    List<Comment> findByIncidentIdOrderByCreatedAtDesc(@Param("incidentId") Long incidentId);
}
