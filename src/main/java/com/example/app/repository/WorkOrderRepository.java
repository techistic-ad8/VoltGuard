package com.example.app.repository;

import com.example.app.entity.WorkOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {
    List<WorkOrder> findByMeterId(String meterId);
    List<WorkOrder> findByStatus(String status);
    boolean existsByMeterIdAndStatus(String meterId, String status);
}
