package com.localhero.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String reviewId;

    @Column(nullable = false)
    private String bookingId;

    @Column(nullable = false)
    private String workerId;

    private String customerName;

    @Column(nullable = false)
    private int rating; // 1-5

    @Column(columnDefinition = "TEXT")
    private String comment;

    private String date;

    // Compatibility getters and setters for frontend and existing service logic
    public String getId() {
        return reviewId;
    }

    public void setId(String id) {
        this.reviewId = id;
    }
}
