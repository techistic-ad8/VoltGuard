# Project Modifications Log (Changelog)

This document contains a log of all modifications, updates, and files added during this iteration of the VoltGuard project.

---

## Summary of Changes

### 1. Modernize-React-Lite Vite Server Port Adjustment
* **[MODIFY] [vite.config.js](file:///d:/Springboot%20Project/modernize-react-lite-main/package/vite.config.js)**
  * *Change*: Updated Vite dev server port to `5173` to prevent port collision with the Next.js dev server on port `3000`.

### 2. Modernize-React-Lite Material-UI Dashboard Customization
* **[NEW] [VoltGuard Branding & Navigation](file:///d:/Springboot%20Project/modernize-react-lite-main/package/src/layouts/full/shared/logo/Logo.js)**: Updated logo to VoltGuard Govt Power Security. Updated sidebar menu items in `MenuItems.js` for Overview, Meter Inventory, Live Telemetry, Work Orders, and H2 Console.
* **[NEW] [CurrentDisparityChart.js](file:///d:/Springboot%20Project/modernize-react-lite-main/package/src/views/dashboard/components/CurrentDisparityChart.js)**: ApexCharts line graph rendering Phase Current ($I_p$), Neutral Current ($I_n$), and Current Disparity ($|I_p - I_n|$).
* **[NEW] [TamperAlertSummary.js](file:///d:/Springboot%20Project/modernize-react-lite-main/package/src/views/dashboard/components/TamperAlertSummary.js)**: Material-UI stat cards for Monitored Meters, Tampered Meters, Grid Voltage, and Active Work Orders.
* **[NEW] [MeterInventoryTable.js](file:///d:/Springboot%20Project/modernize-react-lite-main/package/src/views/dashboard/components/MeterInventoryTable.js)**: Material-UI Table with search filter, badge ID, status Chips, baseline consumption, and a "Simulate" action button.
* **[NEW] [LiveTelemetryLog.js](file:///d:/Springboot%20Project/modernize-react-lite-main/package/src/views/dashboard/components/LiveTelemetryLog.js)**: Material-UI feed showing recent telemetry pings.
* **[NEW] [TelemetrySimulator.js](file:///d:/Springboot%20Project/modernize-react-lite-main/package/src/views/dashboard/components/TelemetrySimulator.js)**: Material-UI form to broadcast pings to `/api/meters/ping` with an Auto-Tamper preset button.
* **[NEW] [WorkOrdersPanel.js](file:///d:/Springboot%20Project/modernize-react-lite-main/package/src/views/dashboard/components/WorkOrdersPanel.js)**: Material-UI list and engineer assignment dialog.
* **[NEW] [Dashboard.js](file:///d:/Springboot%20Project/modernize-react-lite-main/package/src/views/dashboard/Dashboard.js)**: Assembled all VoltGuard components into a clean Material-UI Grid layout.

### 3. Restructuring React Frontend to `frontend1` & Vite Fix
* **[RESTRUCTURE] Moved `modernize-react-lite-main/package` to `frontend1`**: Restructured project layout so `package.json` is located directly at the root of `frontend1/`. Users can now run `cd frontend1` followed by `npm run dev` directly without navigating into nested `package/` subdirectories.
* **[MODIFY] [vite.config.js](file:///d:/Springboot%20Project/frontend1/vite.config.js)**:
  * Updated `load-js-files-as-jsx` esbuild plugin filter regex from `/src\\.*\.js$/` to `/src[\\/].*\.js$/` to ensure path matching works smoothly across both Windows backslashes and normalized forward slashes.
  * Added `host: true` to Vite dev server config.
* **[BRANDING] Removed AdminMart & Modernize template promotional elements**:
  * Removed top `Topbar` promo bar ("AdminMart | Templates | Help | Hire Us ... CHECKOUT PRO VERSION") from `FullLayout.js`.
  * Updated top `Header.js` right section to display a `Grid Surveillance Active` status badge instead of template upgrade buttons.
  * Updated `Upgrade.js` sidebar card to display `VoltGuard Security: Substation Tamper Detection & Telemetry Engine`.
  * Updated `Footer.js` to `© 2026 VoltGuard Smart Energy Surveillance System. Power Grid Security Division.`
  * Updated `index.html` page title to `VoltGuard | Smart Meter & Power Grid Security System`.

---

## Individual Git Commits Record
1. `612883d` - `feat(modernize): configure vite proxy and server settings`
2. `381cf60` - `feat(modernize): update logo and navigation menu items for VoltGuard`
3. `6af32ef` - `feat(modernize): add CurrentDisparityChart ApexCharts component`
4. `7e3cf70` - `feat(modernize): add TamperAlertSummary MUI stat cards component`
5. `666c001` - `feat(modernize): add MeterInventoryTable component`
6. `33142ae` - `feat(modernize): add LiveTelemetryLog feed component`
7. `4d9a97a` - `feat(modernize): add TelemetrySimulator form component`
8. `11cb97c` - `feat(modernize): add WorkOrdersPanel component`
9. `9bd3126` - `feat(modernize): integrate VoltGuard components into Dashboard view`
10. `5185c2a` - `docs: update master documentation and changelog for Modernize dashboard`
11. `95926f7` - `feat(frontend): restructure react app to frontend1 and fix vite dev server launch`
12. `f06ccc5` - `fix(frontend): update MUI dependency versions to stable v6.4.3`
13. `feat(frontend): remove AdminMart promotional elements and apply full VoltGuard branding`
