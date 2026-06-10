package com.localhero.controller;

import com.localhero.entity.Worker;
import com.localhero.service.WorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class WorkerController {

    private final WorkerService workerService;

    // Public: List/search all verified workers
    @GetMapping("/workers")
    public ResponseEntity<List<Worker>> getWorkers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        List<Worker> workers;
        if (search != null && !search.isBlank()) {
            workers = workerService.searchWorkers(search);
        } else if (category != null && !category.isBlank()) {
            workers = workerService.getByCategory(category);
        } else {
            workers = workerService.getAllVerifiedWorkers();
        }
        return ResponseEntity.ok(workers);
    }

    // Public: Get worker details by ID
    @GetMapping("/workers/{id}")
    public ResponseEntity<?> getWorkerById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(workerService.getWorkerById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Worker: Get own profile
    @GetMapping("/worker/profile")
    public ResponseEntity<?> getMyProfile(Authentication auth) {
        try {
            Worker worker = workerService.getWorkerByEmail(auth.getName());
            return ResponseEntity.ok(worker);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Worker: Update own profile
    @PutMapping("/worker/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> updates,
                                           Authentication auth) {
        try {
            Worker worker = workerService.getWorkerByEmail(auth.getName());
            Worker updated = workerService.updateWorkerProfile(worker.getId(), updates);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Add Worker
    @PostMapping("/workers")
    public ResponseEntity<?> addWorker(@RequestBody Worker worker) {
        try {
            Worker created = workerService.addWorker(worker);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Worker: Update profile by workerId
    @PutMapping("/workers/{id}")
    public ResponseEntity<?> updateWorkerById(@PathVariable String id,
                                              @RequestBody Map<String, Object> updates) {
        try {
            Worker updated = workerService.updateWorkerProfile(id, updates);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Admin: Delete worker
    @DeleteMapping("/workers/{id}")
    public ResponseEntity<?> deleteWorker(@PathVariable String id) {
        try {
            workerService.deleteWorker(id);
            return ResponseEntity.ok("Worker deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
