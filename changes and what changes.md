# Project Modifications Log (Changelog)

This document contains a log of all modifications, updates, and files added during this iteration of the VoltGuard project.

---

## Summary of Changes

### 1. Next.js Backend Integration & Data Caching Fix
* **[MODIFY] [frontend/next.config.ts](file:///d:/Springboot%20Project/frontend/next.config.ts)**
  * *Change*: Added API rewrites proxy mapping `/api/*` requests directly to `http://localhost:8085/api/*`.
* **[MODIFY] [frontend/src/app/page.tsx](file:///d:/Springboot%20Project/frontend/src/app/page.tsx)**
  * *Change*: Added `{ cache: 'no-store' }` options to all API `fetch` requests (`/api/meters`, `/api/readings`, `/api/work-orders`) to override Next.js Data Cache. This ensures real-time telemetry pings dynamically update the Next.js UI live on every 3-second poll. Auto-selected the first meter badge ID on initial load so the Telemetry Simulator form is ready out of the box.

### 2. Government Light Theme & Screen Fitting Overhaul
* **[MODIFY] [frontend/src/app/globals.css](file:///d:/Springboot%20Project/frontend/src/app/globals.css)**
  * *Change*: Converted theme palette to an official Government Light Theme (`#f8fafc` slate background, `#ffffff` pure white elevation cards with `#e2e8f0` borders, `#0f172a` deep navy sidebar). Added viewport fitting CSS rules (`max-width: 1600px`, fluid flex topbars, and auto-overflow table wrappers).
* **[MODIFY] [frontend/src/app/layout.tsx](file:///d:/Springboot%20Project/frontend/src/app/layout.tsx)**
  * *Change*: Added `Plus Jakarta Sans` and `Inter` Google Fonts for executive government utility typography.
* **[MODIFY] [src/main/resources/static/dashboard.html](file:///d:/Springboot%20Project/src/main/resources/static/dashboard.html)**
  * *Change*: Updated static prototype with matching light theme styling, fonts, and responsive layout rules.

### 3. Data Security & Sensitive File Protection
* **[MODIFY] [.gitignore](file:///d:/Springboot%20Project/.gitignore)**
  * *Change*: Added explicit exclusion patterns for sensitive datasets (`*.csv`, `*.csv.gz`, `*.gz`), database files (`*.db`, `*.h2.db`), data directories (`data/`, `datasets/`), logs, and environment variable files (`.env`).

### 4. Backend Core & API Updates
* **[MODIFY] [MeterService.java](file:///d:/Springboot%20Project/src/main/java/com/example/app/service/MeterService.java)**
  * *Change*: Fixed `WorkOrder` constructor parameters matching 4 arguments.
* **[MODIFY] [MeterController.java](file:///d:/Springboot%20Project/src/main/java/com/example/app/controller/MeterController.java)**
  * *Change*: Added `PUT /api/work-orders/{id}` endpoint and `@CrossOrigin(origins = "*")` annotation.

### 5. Master Documentation
* **[MODIFY] [PROJECT_DOCUMENTATION.md](file:///d:/Springboot%20Project/PROJECT_DOCUMENTATION.md)**
  * *Change*: Updated master architecture documentation to detail the light theme dashboard, CORS setup, Next.js rewrites proxy, and anti-tampering algorithms.
