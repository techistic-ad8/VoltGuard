package com.example.app.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "work_orders")
public class WorkOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "meter_id", nullable = false)
    private String meterId;

    @Column(nullable = false)
    private String substation;

    @Column(name = "assigned_engineer", nullable = false)
    private String assignedEngineer;

    @Column(nullable = false)
    private String status; // e.g. "TAMPERING", "OPEN", "RESOLVED"

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public WorkOrder() {
    }

    public WorkOrder(String meterId, String substation, String assignedEngineer, String status) {
        this.meterId = meterId;
        this.substation = substation;
        this.assignedEngineer = assignedEngineer;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMeterId() {
        return meterId;
    }

    public void setMeterId(String meterId) {
        this.meterId = meterId;
    }

    public String getSubstation() {
        return substation;
    }

    public void setSubstation(String substation) {
        this.substation = substation;
    }

    public String getAssignedEngineer() {
        return assignedEngineer;
    }

    public void setAssignedEngineer(String assignedEngineer) {
        this.assignedEngineer = assignedEngineer;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
