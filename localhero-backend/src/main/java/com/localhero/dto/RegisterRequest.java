package com.localhero.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class RegisterRequest {
    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 6)
    private String password;

    @NotBlank
    private String role; // CUSTOMER, WORKER, ADMIN

    private String phone;
    private String address;

    // Worker-only fields
    private String skills;
    private String category;
    private double hourlyRate;
    private String description;
    private String licenseNumber;
    private String location;
    private String experience;
}
