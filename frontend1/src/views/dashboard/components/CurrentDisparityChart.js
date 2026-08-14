import React from 'react';
import { Card, CardContent, Typography, Stack, Box } from '@mui/material';
import Chart from 'react-apexcharts';

const CurrentDisparityChart = ({ readings = [] }) => {
  const recentReadings = [...readings].slice(-10);

  const categories = recentReadings.length
    ? recentReadings.map(r => {
        try {
          const date = new Date(r.timestamp);
          return isNaN(date.getTime()) ? r.timestamp : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        } catch {
          return '00:00';
        }
      })
    : ['Read 1', 'Read 2', 'Read 3', 'Read 4', 'Read 5'];

  const phaseData = recentReadings.length
    ? recentReadings.map(r => Number((r.phaseCurrent || 0).toFixed(2)))
    : [5.0, 5.2, 5.1, 5.0, 8.5];

  const neutralData = recentReadings.length
    ? recentReadings.map(r => Number((r.neutralCurrent || 0).toFixed(2)))
    : [5.0, 5.1, 5.0, 5.0, 3.2];

  const deltaData = recentReadings.length
    ? recentReadings.map(r => Number(Math.abs((r.phaseCurrent || 0) - (r.neutralCurrent || 0)).toFixed(2)))
    : [0.0, 0.1, 0.1, 0.0, 5.3];

  const optionscolumnchart = {
    chart: {
      type: 'line',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#64748b',
      toolbar: { show: false },
      height: 320,
      zoom: { enabled: false },
    },
    colors: ['#2563eb', '#7c3aed', '#dc2626'],
    stroke: {
      curve: 'smooth',
      width: [3, 3, 2],
      dashArray: [0, 0, 4],
    },
    dataLabels: { enabled: false },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      labels: { colors: '#334155' },
    },
    grid: {
      borderColor: 'rgba(15,23,42,0.06)',
      strokeDashArray: 3,
    },
    xaxis: {
      categories: categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { 
        text: 'Current (Amps)',
        style: { color: '#64748b', fontWeight: 600, fontSize: '12px' }
      },
      min: 0,
      forceNiceScale: true,
      labels: {
        formatter: (val) => {
          if (val === null || val === undefined) return '0.0 A';
          return `${Number(val).toFixed(1)} A`;
        },
        style: { colors: '#64748b', fontWeight: 500 }
      }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) => `${Number(val).toFixed(2)} Amps`
      }
    },
  };

  const seriescolumnchart = [
    { name: 'Phase Current (Ip)', data: phaseData },
    { name: 'Neutral Current (In)', data: neutralData },
    { name: '|Δ| Disparity (A)', data: deltaData },
  ];

  return (
    <Card variant="outlined" sx={{ borderRadius: '12px', height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h5" fontWeight={700} color="#0f172a">
              Current Disparity Analysis
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Real-time phase vs. neutral current telemetry (|Ip - In|)
            </Typography>
          </Box>
        </Stack>
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="line" height={320} />
      </CardContent>
    </Card>
  );
};

export default CurrentDisparityChart;
