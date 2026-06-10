package com.localhero.controller;

import com.localhero.entity.*;
import com.localhero.repository.*;
import com.localhero.service.WorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final WorkerService workerService;

    // GET /api/admin/stats
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalWorkers", workerRepository.count());
        stats.put("totalBookings", bookingRepository.count());
        stats.put("totalReviews", reviewRepository.count());
        stats.put("pendingBookings", bookingRepository.countByStatus("PENDING"));
        stats.put("completedBookings", bookingRepository.countByStatus("COMPLETED"));
        stats.put("verifiedWorkers", workerRepository.findByVerified(true).size());
        stats.put("unverifiedWorkers", workerRepository.findByVerified(false).size());

        // Revenue estimate
        double revenue = bookingRepository.findByStatus("COMPLETED")
                .stream().mapToDouble(Booking::getTotalAmount).sum();
        stats.put("totalRevenue", revenue);

        return ResponseEntity.ok(stats);
    }

    // GET /api/admin/users — list all users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // PUT /api/admin/users/{id}/block — toggle block
    @PutMapping("/users/{id}/block")
    public ResponseEntity<?> toggleBlock(@PathVariable String id) {
        return userRepository.findById(id).map(user -> {
            user.setBlocked(!user.isBlocked());
            userRepository.save(user);
            return ResponseEntity.ok((Object)(user.isBlocked() ? "User blocked" : "User unblocked"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // GET /api/admin/workers — all workers (verified + unverified)
    @GetMapping("/workers")
    public ResponseEntity<List<Worker>> getAllWorkers() {
        return ResponseEntity.ok(workerService.getAllWorkersForAdmin());
    }

    // PUT /api/admin/workers/{id}/verify — toggle verification
    @PutMapping("/workers/{id}/verify")
    public ResponseEntity<?> verifyWorker(@PathVariable String id) {
        try {
            Worker w = workerService.toggleVerification(id);
            return ResponseEntity.ok(w);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE /api/admin/users/{id}
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        if (!userRepository.existsById(id)) return ResponseEntity.notFound().build();
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted");
    }
}
