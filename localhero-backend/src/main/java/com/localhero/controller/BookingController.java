package com.localhero.controller;

import com.localhero.dto.*;
import com.localhero.entity.Booking;
import com.localhero.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // Customer: Create booking
    @PostMapping({"/booking", "/bookings"})
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request,
                                           Authentication auth) {
        try {
            Booking booking = bookingService.createBooking(request, auth.getName());
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Customer: Get my bookings
    @GetMapping({"/booking/customer", "/bookings/customer"})
    public ResponseEntity<List<Booking>> getCustomerBookings(Authentication auth) {
        return ResponseEntity.ok(bookingService.getBookingsForCustomer(auth.getName()));
    }

    // Worker: Get incoming bookings
    @GetMapping({"/booking/worker", "/bookings/worker"})
    public ResponseEntity<List<Booking>> getWorkerBookings(Authentication auth) {
        return ResponseEntity.ok(bookingService.getBookingsForWorker(auth.getName()));
    }

    // Admin: Get all bookings
    @GetMapping({"/booking", "/bookings"})
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // Spec compliance: PUT /booking/status (accepts bookingId and status in body)
    @PutMapping({"/booking/status", "/bookings/status"})
    public ResponseEntity<?> updateBookingStatusBody(@RequestBody java.util.Map<String, String> body) {
        try {
            String bookingId = body.get("bookingId");
            String status = body.get("status");
            Booking updated = bookingService.updateStatus(bookingId, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Worker / Admin: Update booking status by ID
    @PutMapping({"/booking/{id}/status", "/bookings/{id}/status"})
    public ResponseEntity<?> updateStatus(@PathVariable String id,
                                          @RequestBody BookingStatusRequest request) {
        try {
            Booking updated = bookingService.updateStatus(id, request.getStatus());
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Customer: Cancel booking
    @PutMapping({"/booking/{id}/cancel", "/bookings/{id}/cancel"})
    public ResponseEntity<?> cancelBooking(@PathVariable String id) {
        try {
            bookingService.cancelBooking(id);
            return ResponseEntity.ok("Booking cancelled");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
