package com.example.app.controller;

import com.example.app.entity.Meter;
import com.example.app.entity.MeterReading;
import com.example.app.entity.WorkOrder;
import com.example.app.repository.MeterReadingRepository;
import com.example.app.repository.MeterRepository;
import com.example.app.repository.WorkOrderRepository;
import com.example.app.service.MeterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class MeterController {

    private final MeterService meterService;
    private final MeterRepository meterRepository;
    private final MeterReadingRepository meterReadingRepository;
    private final WorkOrderRepository workOrderRepository;

    public MeterController(MeterService meterService,
                           MeterRepository meterRepository,
                           MeterReadingRepository meterReadingRepository,
                           WorkOrderRepository workOrderRepository) {
        this.meterService = meterService;
        this.meterRepository = meterRepository;
        this.meterReadingRepository = meterReadingRepository;
        this.workOrderRepository = workOrderRepository;
    }

    @PostMapping("/meters/ping")
    public ResponseEntity<String> receivePing(@RequestBody MeterPingRequest request) {
        meterService.processMeterPing(
                request.getMeterId(),
                request.getActiveEnergy(),
                request.getVoltage(),
                request.getPhaseCurrent(),
                request.getNeutralCurrent()
        );
        return ResponseEntity.ok("Ping received and processed successfully.");
    }

    @GetMapping("/meters")
    public ResponseEntity<List<Meter>> getAllMeters() {
        return ResponseEntity.ok(meterRepository.findAll());
    }

    @GetMapping("/readings")
    public ResponseEntity<List<MeterReading>> getAllReadings() {
        return ResponseEntity.ok(meterReadingRepository.findAll());
    }

    @GetMapping("/work-orders")
    public ResponseEntity<List<WorkOrder>> getAllWorkOrders() {
        return ResponseEntity.ok(workOrderRepository.findAll());
    }

    @PutMapping("/work-orders/{id}")
    public ResponseEntity<WorkOrder> updateWorkOrder(@PathVariable Long id, @RequestBody WorkOrder updatedWorkOrder) {
        return workOrderRepository.findById(id)
                .map(workOrder -> {
                    if (updatedWorkOrder.getStatus() != null) {
                        workOrder.setStatus(updatedWorkOrder.getStatus());
                    }
                    if (updatedWorkOrder.getAssignedEngineer() != null) {
                        workOrder.setAssignedEngineer(updatedWorkOrder.getAssignedEngineer());
                    }
                    return ResponseEntity.ok(workOrderRepository.save(workOrder));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
