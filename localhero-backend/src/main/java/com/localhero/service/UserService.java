package com.localhero.service;

import com.localhero.dto.*;
import com.localhero.entity.*;
import com.localhero.repository.*;
import com.localhero.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        String verificationToken = java.util.UUID.randomUUID().toString();

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(req.getRole().toUpperCase())
                .phone(req.getPhone())
                .address(req.getAddress())
                .emailVerified(true)
                .verificationToken(verificationToken)
                .build();

        user = userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), verificationToken);

        String workerId = null;
        if ("WORKER".equalsIgnoreCase(req.getRole())) {
            Worker worker = Worker.builder()
                    .user(user)
                    .skill(req.getSkills())
                    .category(req.getCategory())
                    .hourlyRate(req.getHourlyRate())
                    .description(req.getDescription())
                    .licenseNumber(req.getLicenseNumber())
                    .location(req.getLocation())
                    .experience(req.getExperience())
                    .verified(false)
                    .status("PENDING")
                    .build();
            worker = workerRepository.save(worker);
            workerId = worker.getId();
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .workerId(workerId)
                .build();
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (user.isBlocked()) {
            throw new RuntimeException("Account has been suspended. Please contact admin.");
        }

        if (!user.isEmailVerified()) {
            throw new RuntimeException("Please verify your email first");
        }

        String workerId = null;
        if ("WORKER".equals(user.getRole())) {
            workerId = workerRepository.findByUserId(user.getId())
                    .map(Worker::getId).orElse(null);
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .workerId(workerId)
                .build();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
