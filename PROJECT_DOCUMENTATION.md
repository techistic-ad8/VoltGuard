# VoltGuard - Complete System Documentation

VoltGuard is a smart grid security and anti-tampering platform designed to detect electricity theft and hardware bypasses at distribution substations in real time.

---

## 1. Executive Summary & Core Mechanics

* **Core Problem**: Unlawful electrical bypasses (where consumers divert current away from the metering coil) cause significant energy loss and grid instability.
* **Detection Principle**: Under normal operation, phase current ($I_p$) equals neutral current ($I_n$). When a physical bypass or tamper occurs, a current disparity emerges:
  $$\Delta I = |I_p - I_n|$$
  If $\Delta I > 2.0\text{ Amps}$, VoltGuard flags the meter as `FLAGGED_TAMPERED` and generates an automatic `WorkOrder` for substation technician dispatch.

---

## 2. Multi-Tier System Architecture

```mermaid
graph TD
    subgraph Frontend Layer
        ModernizeUI[Modernize React Lite Dashboard - Vite + MUI v9 - Port 3000]
        NextJS[Next.js App Router SPA - Port 3000]
        StaticUI[Elevated Static HTML/CSS Dashboard - Port 8085]
    end

    subgraph Backend Layer (Spring Boot 3.3 / Java 17/21)
        Controller[MeterController / @CrossOrigin]
        MeterSvc[MeterService - Anomaly Engine]
        CsvSvc[CsvImportService - Startup Importer]
    end

    subgraph Persistence Layer
        Repos[Spring Data JPA Repositories]
        DB[(H2 In-Memory DB / PostgreSQL)]
    end

    ModernizeUI -->|HTTP / Vite Proxy| Controller
    NextJS -->|HTTP / Next Rewrites| Controller
    StaticUI -->|HTTP Same-Origin| Controller
    Controller --> MeterSvc
    MeterSvc --> Repos
    CsvSvc --> Repos
    Repos --> DB
```

---

## 3. Backend REST API Specification

### `POST /api/meters/ping`
Broadcasting smart meter telemetry.
* **Request Body**:
  ```json
  {
    "meterId": "PO10297553",
    "activeEnergy": 5.24,
    "voltage": 230.0,
    "phaseCurrent": 0.45,
    "neutralCurrent": 4.80
  }
  ```

### `GET /api/meters`
Returns list of all monitored meters.

### `GET /api/readings`
Returns historical telemetry logs.

### `GET /api/work-orders`
Returns list of all maintenance tickets.

### `PUT /api/work-orders/{id}`
Updates a work order's assigned engineer or status.

---

## 4. Modernize-React-Lite Material-UI Dashboard (`/modernize-react-lite-main/package`)
* **Framework**: React 19, Vite, Material-UI v9 (`@mui/material`), ApexCharts (`react-apexcharts`), Tabler Icons (`@tabler/icons-react`).
* **Location**: `d:\Springboot Project\modernize-react-lite-main\package\`
* **Custom Modules**:
  - `CurrentDisparityChart.js`: ApexCharts smooth curves rendering $I_p$, $I_n$, and $|I_p - I_n|$.
  - `TamperAlertSummary.js`: MUI Stat Cards for Total Monitored Meters, Tampered Meters, Grid Voltage, and Active Work Orders.
  - `MeterInventoryTable.js`: MUI Data Table with search filter, badge ID, status Chips, baseline consumption, and a "Simulate" action button.
  - `LiveTelemetryLog.js`: MUI Feed showing incoming telemetry broadcasts.
  - `TelemetrySimulator.js`: MUI Form to construct pings with an Auto-Tamper preset button.
  - `WorkOrdersPanel.js`: MUI Work orders list, engineer assignment dialog, and resolution trigger buttons.

---

## 5. Development & Execution Instructions

### Step 1: Start Backend (Spring Boot)
```powershell
.\mvnw spring-boot:run
```
* API Server: `http://localhost:8085`

### Step 2: Start Modernize Material-UI Dashboard
```powershell
cd modernize-react-lite-main/package
npm run dev
```
* Modernize Dashboard: `http://localhost:3000`
