package com.localhero.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String bookingId;

    @Column(nullable = false)
    private String customerId;

    private String customerName;

    @Column(nullable = false)
    private String workerId;

    private String workerName;

    private String service;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String bookingDate;
    private String time;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Builder.Default
    private String status = "PENDING"; // PENDING, ACCEPTED, COMPLETED, REJECTED

    private double hours;
    private double totalAmount;

    @Builder.Default
    private boolean reviewed = false;

    // Compatibility getters and setters for frontend and existing service logic
    public String getId() {
        return bookingId;
    }

    public void setId(String id) {
        this.bookingId = id;
    }

    public String getDate() {
        return bookingDate;
    }

    public void setDate(String date) {
        this.bookingDate = date;
    }
}
