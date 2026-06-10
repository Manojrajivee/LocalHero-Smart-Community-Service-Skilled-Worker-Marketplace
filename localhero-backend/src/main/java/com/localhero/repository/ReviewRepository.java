package com.localhero.repository;

import com.localhero.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findByWorkerId(String workerId);
    boolean existsByBookingId(String bookingId);
}
