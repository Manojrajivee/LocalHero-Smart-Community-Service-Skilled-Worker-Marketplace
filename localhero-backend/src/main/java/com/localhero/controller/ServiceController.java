package com.localhero.controller;

import com.localhero.entity.Service;
import com.localhero.service.ServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceService serviceService;

    @GetMapping({"/service", "/services"})
    public ResponseEntity<List<Service>> getAllServices() {
        return ResponseEntity.ok(serviceService.getAllServices());
    }

    @GetMapping({"/service/{id}", "/services/{id}"})
    public ResponseEntity<Service> getServiceById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(serviceService.getServiceById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping({"/service", "/services"})
    public ResponseEntity<Service> createService(@RequestBody Service service) {
        return ResponseEntity.ok(serviceService.createService(service));
    }

    @PutMapping({"/service/{id}", "/services/{id}"})
    public ResponseEntity<?> updateService(@PathVariable String id, @RequestBody Service service) {
        try {
            return ResponseEntity.ok(serviceService.updateService(id, service));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping({"/service/{id}", "/services/{id}"})
    public ResponseEntity<?> deleteService(@PathVariable String id) {
        try {
            serviceService.deleteService(id);
            return ResponseEntity.ok("Service deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
