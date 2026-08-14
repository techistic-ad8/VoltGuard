# VoltGuard System Architecture

VoltGuard is a smart grid monitoring and security system designed to detect electricity theft and physical bypasses (tampering) at the consumer meter level. This document details the architectural layers and components of the system.

## 1. High-Level Design Diagram
```mermaid
graph TD
    subgraph Client Layer (Frontend SPA)
        UI[index.html / CSS / JS]
        Chart[Chart.js Energy Tracker]
    end

    subgraph Controller Layer (API Endpoints)
        MC[MeterController]
    end

    subgraph Service Layer (Business Logic)
        MS[MeterService]
        CIS[CsvImportService]
    end

    subgraph Repository Layer (Spring Data JPA)
        MR[MeterRepository]
        MRR[MeterReadingRepository]
        WOR[WorkOrderRepository]
    end

    subgraph Database Layer (H2)
        H2[(In-Memory Database)]
    end

    UI -->|REST / HTTP| MC
    MC -->|Invoke Services| MS
    MC -->|Query Repositories| WOR
    MC -->|Query Repositories| MR
    MC -->|Query Repositories| MRR
    
    CIS -->|Initialize Base Data| MR
    CIS -->|Simulate Initial Telemetry| MS

    MS -->|Persist & Read| MR
    MS -->|Persist & Read| MRR
    MS -->|Persist & Read| WOR

    MR & MRR & WOR -->|Spring Data JPA| H2
```

## 2. Tiered Component Structure

### Presentation Layer (Frontend)
- **Files**: `index.html`, `style.css`, `app.js` under `src/main/resources/static/`.
- **Purpose**: Provides a real-time responsive dashboard showcasing monitored metrics, live telemetry logs, active maintenance tickets, and an interactive telemetry simulator.
- **Framework**: No complex bundlers needed; served directly by Spring Boot as a single-page application using HTML5, vanilla CSS, and vanilla JS. Renders energy tracking charts using Chart.js.

### API Controller Layer
- **Files**: `MeterController.java`, `MeterPingRequest.java` under `com.example.app.controller`.
- **Endpoints**:
  - `POST /api/meters/ping`: Receives telemetry reports from smart meters.
  - `GET /api/meters`: Fetches the inventory of all meters.
  - `GET /api/readings`: Retrieves historical telemetry logs.
  - `GET /api/work-orders`: Returns a list of all maintenance tickets.
  - `PUT /api/work-orders/{id}`: Updates a work order's status or assigned operator.

### Business Service Layer
- **Files**: `MeterService.java`, `CsvImportService.java` under `com.example.app.service`.
- **CSV Data Import**: At system startup, `CsvImportService` parses raw billing consumption reports from `D:\MVVNL_DIV392263_APR_2026.csv.gz` to populate baseline parameters for 100 meters.
- **Anomaly Detection**: `MeterService` processes incoming smart meter telemetry (pings). If the absolute disparity between **phase current (Ip)** and **neutral current (In)** exceeds `2.0 Amps` (the threshold indicative of a physical bypass or earth-return bypass), the service:
  1. Flags the meter status as `FLAGGED_TAMPERED`.
  2. Spawns an automatic, unassigned `WorkOrder` ticket for the Substation engineering crew.

### Data Access & Storage Layer
- **Entities**: `Meter`, `MeterReading`, `WorkOrder` mapped via Jakarta Persistence (JPA).
- **Repositories**: `MeterRepository`, `MeterReadingRepository`, `WorkOrderRepository` extending `JpaRepository` for boilerplate CRUD operations.
- **Database**: H2 In-Memory Database (`jdbc:h2:mem:voltguard`) is active during development to ensure zero setup for local testing. In production, the application is compatible with PostgreSQL.
