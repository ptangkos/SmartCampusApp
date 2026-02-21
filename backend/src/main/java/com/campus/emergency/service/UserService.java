package com.campus.emergency.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.campus.emergency.dto.RegisterRequest;
import com.campus.emergency.model.Role;
import com.campus.emergency.model.User;
import com.campus.emergency.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(RegisterRequest request) {
        User user = new User();
        user.setSpireId(request.getSpireId());
        user.setFullName(request.getFullName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? Role.valueOf(request.getRole()) : Role.STUDENT);
        return userRepository.save(user);
    }

    public User findBySpireId(String spireId) {
        return userRepository.findBySpireId(spireId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public void updatePushTokenForCurrentUser(String token) {
        String spireId = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = findBySpireId(spireId);
        user.setPushNotificationToken(token);
        userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String spireId) throws UsernameNotFoundException {
        User user = findBySpireId(spireId);
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getSpireId())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }
}