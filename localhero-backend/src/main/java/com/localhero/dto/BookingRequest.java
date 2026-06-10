package com.localhero.dto;

import lombok.Data;

@Data
public class BookingRequest {
    private String workerId;
    private String workerName;
    private String service;
    private String description;
    private String date;
    private String time;
    private String notes;
    private double hours;
    private double totalAmount;
}
