package com.localhero.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // CUSTOMER, WORKER, ADMIN

    private String phone;
    private String address;

    @Column(nullable = false)
    @Builder.Default
    private boolean blocked = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean emailVerified = false;

    private String verificationToken;
}
