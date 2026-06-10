package com.localhero.dto;

import lombok.Data;

@Data
public class BookingStatusRequest {
    private String status; // ACCEPTED, REJECTED, COMPLETED
}
