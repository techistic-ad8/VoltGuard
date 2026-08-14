package com.example.app.service;

import com.example.app.entity.Meter;
import com.example.app.entity.MeterReading;
import com.example.app.entity.WorkOrder;
import com.example.app.repository.MeterReadingRepository;
import com.example.app.repository.MeterRepository;
import com.example.app.repository.WorkOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class MeterService {

    private final MeterRepository meterRepository;
    private final MeterReadingRepository readingRepository;
    private final WorkOrderRepository workOrderRepository;

    // Constructor Injection (Spring automatically injects our repositories here)
    public MeterService(MeterRepository meterRepository,
            MeterReadingRepository readingRepository,
            WorkOrderRepository workOrderRepository) {
        this.meterRepository = meterRepository;
        this.readingRepository = readingRepository;
        this.workOrderRepository = workOrderRepository;
    }

    @Transactional
    public void processMeterPing(String meterId, Double activeEnergy, Double voltage, Double phaseCurrent,
            Double neutralCurrent) {
        // 1. Find or Create the Meter
        Meter meter = meterRepository.findByMeterId(meterId)
                .orElseGet(() -> {
                    // Create default meter if it's the first time we see it
                    Meter newMeter = new Meter(meterId, "ACTIVE", 10.0);
                    return meterRepository.save(newMeter);
                });

        // 2. Save the incoming reading to the history
        MeterReading reading = new MeterReading(meterId, LocalDateTime.now(), activeEnergy, voltage, phaseCurrent,
                neutralCurrent);
        readingRepository.save(reading);

        // 3. Quick Threshold Check: Phase-Neutral Disparity
        // Under normal operation, phase current (Ip) should equal neutral current (In).
        // If they differ by more than 2.0 Amps, it indicates a hardware
        // bypass/tampering.
        double currentDifference = Math.abs(phaseCurrent - neutralCurrent);
        if (currentDifference > 2.0) {
            // Flag the meter status as tampered
            meter.setStatus("FLAGGED_TAMPERED");
            meterRepository.save(meter);

            // Generate an automatic Work Order for the substation team
            WorkOrder workOrder = new WorkOrder(
                    meterId,
                    "Substation Delta-1", // Substation area
                    "Unassigned", // Assigned engineer (to be set by admin/AI)
                    "TAMPERING");
            workOrderRepository.save(workOrder);
        }
    }
}
