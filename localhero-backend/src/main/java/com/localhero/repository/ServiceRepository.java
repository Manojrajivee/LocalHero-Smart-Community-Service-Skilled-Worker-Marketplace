package com.localhero.repository;

import com.localhero.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, String> {
    List<Service> findByServiceNameContainingIgnoreCase(String serviceName);
}
