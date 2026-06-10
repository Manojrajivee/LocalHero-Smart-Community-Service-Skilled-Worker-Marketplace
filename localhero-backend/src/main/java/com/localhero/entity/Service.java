package com.localhero.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "services")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String serviceId;

    @Column(nullable = false)
    private String serviceName;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Compatibility getter/setter for id
    public String getId() {
        return serviceId;
    }

    public void setId(String id) {
        this.serviceId = id;
    }
}
