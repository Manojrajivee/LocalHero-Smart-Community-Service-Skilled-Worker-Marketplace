package com.localhero.entity;

import jakarta.persistence.*;
import jakarta.persistence.Transient;
import lombok.*;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

@Entity
@Table(name = "workers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String workerId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String skill; // Comma-separated e.g. "Plumbing,Electrical"
    private String category;
    private double hourlyRate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    private double rating = 0.0;

    @Builder.Default
    private int reviewsCount = 0;

    @Builder.Default
    private boolean verified = false;

    @Builder.Default
    private String status = "PENDING"; // PENDING, APPROVED, BLOCKED

    private String licenseNumber;
    private String location;
    private String profileImage;
    private String experience;

    @Transient
    @Builder.Default
    private List<Review> reviews = new ArrayList<>();

    // Compatibility getters and setters for frontend and existing service logic
    public String getId() {
        return workerId;
    }

    public void setId(String id) {
        this.workerId = id;
    }

    public List<String> getSkills() {
        if (skill == null || skill.isBlank()) {
            return List.of();
        }
        return Arrays.asList(skill.split(","));
    }

    public void setSkills(String skills) {
        this.skill = skills;
    }

    public String getName() {
        return user != null ? user.getName() : null;
    }

    public String getEmail() {
        return user != null ? user.getEmail() : null;
    }

    public String getPhone() {
        return user != null ? user.getPhone() : null;
    }
}
