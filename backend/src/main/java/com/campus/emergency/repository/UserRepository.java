package com.campus.emergency.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campus.emergency.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findBySpireId(String spireId);
}