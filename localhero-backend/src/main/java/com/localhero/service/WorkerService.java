package com.localhero.service;

import com.localhero.entity.*;
import com.localhero.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    public List<Worker> getAllVerifiedWorkers() {
        return workerRepository.findByVerified(true);
    }

    public List<Worker> searchWorkers(String query) {
        if (query == null || query.isBlank()) {
            return workerRepository.findByVerified(true);
        }
        return workerRepository.searchVerifiedWorkers(query);
    }

    public List<Worker> getByCategory(String category) {
        return workerRepository.findVerifiedByCategory(category);
    }

    public Worker getWorkerById(String id) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Worker not found: " + id));
        worker.setReviews(reviewRepository.findByWorkerId(id));
        return worker;
    }

    public Worker getWorkerByUserId(String userId) {
        Worker worker = workerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Worker profile not found"));
        worker.setReviews(reviewRepository.findByWorkerId(worker.getId()));
        return worker;
    }

    public Worker getWorkerByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        Worker worker = workerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Worker profile not found"));
        worker.setReviews(reviewRepository.findByWorkerId(worker.getId()));
        return worker;
    }

    public Worker addWorker(Worker worker) {
        if (worker.getStatus() == null) {
            worker.setStatus("PENDING");
        }
        return workerRepository.save(worker);
    }

    public Worker updateWorker(String id, Map<String, Object> updates) {
        return updateWorkerProfile(id, updates);
    }

    public Worker updateWorkerProfile(String workerId, Map<String, Object> updates) {
        Worker worker = getWorkerById(workerId);
        if (updates.containsKey("skills"))       worker.setSkill((String) updates.get("skills"));
        if (updates.containsKey("skill"))        worker.setSkill((String) updates.get("skill"));
        if (updates.containsKey("category"))     worker.setCategory((String) updates.get("category"));
        if (updates.containsKey("description"))  worker.setDescription((String) updates.get("description"));
        if (updates.containsKey("location"))     worker.setLocation((String) updates.get("location"));
        if (updates.containsKey("experience"))   worker.setExperience((String) updates.get("experience"));
        if (updates.containsKey("hourlyRate"))   worker.setHourlyRate(((Number) updates.get("hourlyRate")).doubleValue());
        if (updates.containsKey("licenseNumber")) worker.setLicenseNumber((String) updates.get("licenseNumber"));
        if (updates.containsKey("status"))       worker.setStatus((String) updates.get("status"));
        return workerRepository.save(worker);
    }

    public Worker toggleVerification(String workerId) {
        Worker worker = getWorkerById(workerId);
        worker.setVerified(!worker.isVerified());
        if (worker.isVerified()) {
            worker.setStatus("APPROVED");
        } else {
            worker.setStatus("PENDING");
        }
        return workerRepository.save(worker);
    }

    public List<Worker> getAllWorkersForAdmin() {
        return workerRepository.findAll();
    }

    public void updateRating(String workerId, int newRating) {
        Worker worker = getWorkerById(workerId);
        double total = worker.getRating() * worker.getReviewsCount() + newRating;
        worker.setReviewsCount(worker.getReviewsCount() + 1);
        worker.setRating(total / worker.getReviewsCount());
        workerRepository.save(worker);
    }

    public void deleteWorker(String workerId) {
        workerRepository.deleteById(workerId);
    }
}
