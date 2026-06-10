package com.localhero.service;

import com.localhero.entity.Service;
import com.localhero.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import java.util.List;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }

    public Service getServiceById(String serviceId) {
        return serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found: " + serviceId));
    }

    public Service createService(Service service) {
        return serviceRepository.save(service);
    }

    public Service updateService(String serviceId, Service updatedService) {
        Service existing = getServiceById(serviceId);

        existing.setServiceName(updatedService.getServiceName());
        existing.setDescription(updatedService.getDescription());

        return serviceRepository.save(existing);
    }

    public void deleteService(String serviceId) {
        serviceRepository.deleteById(serviceId);
    }
}