package com.localhero.controller;

import com.localhero.dto.*;
import com.localhero.entity.User;
import com.localhero.repository.UserRepository;
import com.localhero.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;

    @GetMapping({"/verify", "/auth/verify"})
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        return userRepository.findByVerificationToken(token).map(user -> {
            user.setEmailVerified(true);
            user.setVerificationToken(null);
            userRepository.save(user);
            return ResponseEntity.ok("Email Verified Successfully");
        }).orElse(ResponseEntity.badRequest().body("Invalid verification token"));
    }

    @PostMapping({"/register", "/auth/register"})
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = userService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping({"/login", "/auth/login"})
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = userService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
