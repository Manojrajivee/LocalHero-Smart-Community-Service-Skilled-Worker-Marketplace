package com.localhero.repository;

import com.localhero.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface WorkerRepository extends JpaRepository<Worker, String> {

    Optional<Worker> findByUserId(String userId);

    List<Worker> findByVerified(boolean verified);

    @Query("SELECT w FROM Worker w WHERE w.verified = true AND " +
           "(LOWER(w.skill) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(w.category) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(w.user.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(w.location) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Worker> searchVerifiedWorkers(@Param("query") String query);

    @Query("SELECT w FROM Worker w WHERE w.verified = true AND " +
           "LOWER(w.category) LIKE LOWER(CONCAT('%', :category, '%'))")
    List<Worker> findVerifiedByCategory(@Param("category") String category);
}
