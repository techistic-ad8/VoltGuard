import React, { useState, useEffect } from 'react';
import { Grid, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

// VoltGuard Components
import TamperAlertSummary from './components/TamperAlertSummary';
import CurrentDisparityChart from './components/CurrentDisparityChart';
import MeterInventoryTable from './components/MeterInventoryTable';
import LiveTelemetryLog from './components/LiveTelemetryLog';
import TelemetrySimulator from './components/TelemetrySimulator';
import WorkOrdersPanel from './components/WorkOrdersPanel';

const Dashboard = () => {
  const [meters, setMeters] = useState([]);
  const [readings, setReadings] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [selectedMeterId, setSelectedMeterId] = useState('');

  const fetchData = async () => {
    try {
      const [mRes, rRes, wRes] = await Promise.all([
        fetch('/api/meters', { cache: 'no-store' }).then(res => res.json()),
        fetch('/api/readings', { cache: 'no-store' }).then(res => res.json()),
        fetch('/api/work-orders', { cache: 'no-store' }).then(res => res.json()),
      ]);

      if (Array.isArray(mRes)) {
        setMeters(mRes);
        if (mRes.length > 0 && !selectedMeterId) {
          setSelectedMeterId(mRes[0].meterId);
        }
      }
      if (Array.isArray(rRes)) setReadings(rRes);
      if (Array.isArray(wRes)) setWorkOrders(wRes);
    } catch (err) {
      console.error('Failed to fetch VoltGuard data:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageContainer title="VoltGuard Substation Monitoring Portal" description="Real-time Anti-Tampering & Energy Surveillance">
      <Box>
        {/* KPI Stat Cards */}
        <Box mb={3}>
          <TamperAlertSummary meters={meters} readings={readings} workOrders={workOrders} />
        </Box>

        <Grid container spacing={3}>
          {/* Current Disparity Chart (7) */}
          <Grid item xs={12} lg={7}>
            <CurrentDisparityChart readings={readings} />
          </Grid>

          {/* Telemetry Simulator (5) */}
          <Grid item xs={12} lg={5}>
            <TelemetrySimulator
              meters={meters}
              selectedMeterId={selectedMeterId}
              setSelectedMeterId={setSelectedMeterId}
              onPingSuccess={fetchData}
            />
          </Grid>

          {/* Active Work Orders (4) */}
          <Grid item xs={12} lg={4} id="work-orders">
            <WorkOrdersPanel workOrders={workOrders} onRefresh={fetchData} />
          </Grid>

          {/* Meter Inventory Table (8) */}
          <Grid item xs={12} lg={8} id="meters">
            <MeterInventoryTable meters={meters} onSelectMeter={id => setSelectedMeterId(id)} />
          </Grid>

          {/* Live Telemetry Feed (12) */}
          <Grid item xs={12} id="telemetry">
            <LiveTelemetryLog readings={readings} />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
