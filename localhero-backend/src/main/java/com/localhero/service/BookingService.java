package com.localhero.service;

import com.localhero.dto.BookingRequest;
import com.localhero.entity.*;
import com.localhero.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;

    public Booking createBooking(BookingRequest req, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Worker worker = workerRepository.findById(req.getWorkerId())
                .orElseThrow(() -> new RuntimeException("Worker not found"));

        Booking booking = Booking.builder()
                .customerId(customer.getId())
                .customerName(customer.getName())
                .workerId(req.getWorkerId())
                .workerName(req.getWorkerName() != null ? req.getWorkerName() : worker.getUser().getName())
                .service(req.getService())
                .description(req.getDescription())
                .bookingDate(req.getDate())
                .time(req.getTime())
                .notes(req.getNotes())
                .hours(req.getHours())
                .totalAmount(req.getTotalAmount())
                .status("PENDING")
                .build();

        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsForCustomer(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByCustomerId(user.getId());
    }

    public List<Booking> getBookingsForWorker(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Worker worker = workerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Worker profile not found"));
        return bookingRepository.findByWorkerId(worker.getId());
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking updateStatus(String bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status.toUpperCase());
        return bookingRepository.save(booking);
    }

    public Booking markReviewed(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setReviewed(true);
        return bookingRepository.save(booking);
    }

    public void cancelBooking(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }
}
