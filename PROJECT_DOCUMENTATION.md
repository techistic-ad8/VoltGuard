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

    NextJS -->|HTTP / CORS| Controller
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
* **Behavior**:
  1. Finds or registers the `Meter`.
  2. Saves telemetry record to `MeterReading`.
  3. Evaluates $|I_p - I_n| > 2.0\text{A}$. If true, sets status to `FLAGGED_TAMPERED` and creates an open `WorkOrder`.

### `GET /api/meters`
Returns list of all monitored meters.

### `GET /api/readings`
Returns historical telemetry logs.

### `GET /api/work-orders`
Returns list of all maintenance tickets.

### `PUT /api/work-orders/{id}`
Updates a work order's assigned engineer or status.
* **Request Body**:
  ```json
  {
    "assignedEngineer": "Engineer Sarah Chen",
    "status": "OPEN"
  }
  ```

---

## 4. Frontend Application Architecture

VoltGuard provides two UI options:

### Option A: Next.js Standalone Application (`/frontend`)
* **Framework**: Next.js 16 App Router, TypeScript, React 19, Vanilla CSS.
* **Location**: `d:\Springboot Project\frontend\`
* **Key Components**:
  - `src/app/page.tsx`: Client dashboard with live polling, KPI metrics cards, interactive Chart.js line graphs, mock ping simulator, and engineer assignment modals.
  - `src/app/globals.css`: Dark glassmorphism stylesheet.

### Option B: Elevated Static Prototype (`dashboard.html` / `index.html`)
* **Location**: `src/main/resources/static/dashboard.html` & `index.html`
* **Features**: Embedded single-file dashboard using vanilla HTML5, CSS variables, and Lucide icons.

---

## 5. Development & Execution Instructions

### Step 1: Start Backend (Spring Boot)
Run from the root directory:
```powershell
.\mvnw spring-boot:run
```
* API Server: `http://localhost:8085`
* H2 Database Console: `http://localhost:8085/h2-console` (JDBC URL: `jdbc:h2:mem:voltguard`, User: `sa`, Password: blank)
* Static Prototype: `http://localhost:8085/dashboard.html`

### Step 2: Start Next.js Frontend
Run from the `frontend/` directory:
```powershell
cd frontend
npm run dev
```
* Next.js UI: `http://localhost:3000`

---

## 6. Repository Publishing & Git Workflow Rule
Per `gemini.md` and `.agents/AGENTS.md` guidelines:
1. Every code edit must update `changes and what changes.md`.
2. Changes must be committed using Conventional Commits (`feat: ...`, `fix: ...`, `docs: ...`).
3. Changes must be pushed directly to origin branch `main`.
