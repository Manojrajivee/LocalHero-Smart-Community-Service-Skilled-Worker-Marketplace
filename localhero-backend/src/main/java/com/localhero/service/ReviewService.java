package com.localhero.service;

import com.localhero.dto.ReviewRequest;
import com.localhero.entity.*;
import com.localhero.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final WorkerService workerService;
    private final UserRepository userRepository;

    public Review addReview(ReviewRequest req, String customerEmail) {
        if (reviewRepository.existsByBookingId(req.getBookingId())) {
            throw new RuntimeException("Review already submitted for this booking");
        }

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Review review = Review.builder()
                .bookingId(req.getBookingId())
                .workerId(req.getWorkerId())
                .customerName(customer.getName())
                .rating(req.getRating())
                .comment(req.getComment())
                .date(LocalDate.now().toString())
                .build();

        review = reviewRepository.save(review);

        // Mark booking as reviewed
        bookingRepository.findById(req.getBookingId()).ifPresent(b -> {
            b.setReviewed(true);
            bookingRepository.save(b);
        });

        // Recalculate worker rating
        workerService.updateRating(req.getWorkerId(), req.getRating());

        return review;
    }

    public List<Review> getReviewsForWorker(String workerId) {
        return reviewRepository.findByWorkerId(workerId);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
}
