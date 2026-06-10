package com.localhero.repository;

import com.localhero.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findByCustomerId(String customerId);
    List<Booking> findByWorkerId(String workerId);
    List<Booking> findByStatus(String status);
    long countByStatus(String status);
}
