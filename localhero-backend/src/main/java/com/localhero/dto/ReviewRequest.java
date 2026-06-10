package com.localhero.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private String bookingId;
    private String workerId;
    private int rating;
    private String comment;
}
