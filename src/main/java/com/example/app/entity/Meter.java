package com.example.app.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "meters")

public class Meter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "meter_id", unique = true, nullable = false)
    private String meterId; // e.g. "MTR-1004"
    @Column(nullable = false)
    private String status; // ACTIVE, DISCONNECTED, SUSPENDED
    @Column(name = "baseline_kwh")
    private Double baselineKwh; // 30-day average consumption
    @Version
    private Long version; // Optimistic locking version check
    // Default Constructor (Required by JPA)

    public Meter() {
    }

    // Constructor with fields
    public Meter(String meterId, String status, Double baselineKwh) {
        this.meterId = meterId;
        this.status = status;
        this.baselineKwh = baselineKwh;
    }

    // Getters and Setters
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getBaselineKwh() {
        return baselineKwh;
    }

    public void setBaselineKwh(Double baselineKwh) {
        this.baselineKwh = baselineKwh;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

}
