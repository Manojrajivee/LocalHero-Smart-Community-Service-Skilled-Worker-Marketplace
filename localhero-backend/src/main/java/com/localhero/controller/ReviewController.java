package com.localhero.controller;

import com.localhero.dto.ReviewRequest;
import com.localhero.entity.Review;
import com.localhero.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // Customer: Submit review
    @PostMapping({"/review", "/reviews"})
    public ResponseEntity<?> addReview(@RequestBody ReviewRequest request,
                                       Authentication auth) {
        try {
            Review review = reviewService.addReview(request, auth.getName());
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Public: Get reviews for a worker
    @GetMapping({"/review/worker/{workerId}", "/reviews/worker/{workerId}"})
    public ResponseEntity<List<Review>> getWorkerReviews(@PathVariable String workerId) {
        return ResponseEntity.ok(reviewService.getReviewsForWorker(workerId));
    }

    // Admin/Public: Get all reviews
    @GetMapping({"/review", "/reviews"})
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }
}
