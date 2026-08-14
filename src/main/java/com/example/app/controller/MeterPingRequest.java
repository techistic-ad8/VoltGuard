package com.example.app.controller;

public class MeterPingRequest {
    private String meterId;
    private Double activeEnergy;
    private Double voltage;
    private Double phaseCurrent;
    private Double neutralCurrent;

    // Default Constructor
    public MeterPingRequest() {
    }

    // Getters and Setters
    public String getMeterId() {
        return meterId;
    }

    public void setMeterId(String meterId) {
        this.meterId = meterId;
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
