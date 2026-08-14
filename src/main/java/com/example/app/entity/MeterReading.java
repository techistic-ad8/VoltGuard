package com.example.app.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "meter_readings")
public class MeterReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "meter_id", nullable = false)
    private String meterId;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "active_energy", nullable = false)
    private Double activeEnergy; // cumulative kWh

    @Column(nullable = false)
    private Double voltage; // Line Voltage (V)

    @Column(name = "phase_current", nullable = false)
    private Double phaseCurrent; // I_p (A)

    @Column(name = "neutral_current", nullable = false)
    private Double neutralCurrent; // I_n (A)

    // Default Constructor
    public MeterReading() {
    }

    // Constructor with fields
    public MeterReading(String meterId, LocalDateTime timestamp, Double activeEnergy, Double voltage,
            Double phaseCurrent, Double neutralCurrent) {
        this.meterId = meterId;
        this.timestamp = timestamp;
        this.activeEnergy = activeEnergy;
        this.voltage = voltage;
        this.phaseCurrent = phaseCurrent;
        this.neutralCurrent = neutralCurrent;
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

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Double getActiveEnergy() {
        return activeEnergy;
    }

    public void setActiveEnergy(Double activeEnergy) {
        this.activeEnergy = activeEnergy;
    }

    public Double getVoltage() {
        return voltage;
    }

    public void setVoltage(Double voltage) {
        this.voltage = voltage;
    }

    public Double getPhaseCurrent() {
        return phaseCurrent;
    }

    public void setPhaseCurrent(Double phaseCurrent) {
        this.phaseCurrent = phaseCurrent;
    }

    public Double getNeutralCurrent() {
        return neutralCurrent;
    }

    public void setNeutralCurrent(Double neutralCurrent) {
        this.neutralCurrent = neutralCurrent;
    }
}