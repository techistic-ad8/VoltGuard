import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Stack, Box } from '@mui/material';
import Chart from 'react-apexcharts';

const CurrentDisparityChart = ({ readings }) => {
  const theme = useTheme();

  const recentReadings = [...readings].slice(-10);
  const categories = recentReadings.map(r => new Date(r.timestamp).toLocaleTimeString());
  const phaseData = recentReadings.map(r => r.phaseCurrent);
  const neutralData = recentReadings.map(r => r.neutralCurrent);
  const deltaData = recentReadings.map(r => Math.abs(r.phaseCurrent - r.neutralCurrent));

  const optionscolumnchart = {
    chart: {
      type: 'line',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#64748b',
      toolbar: { show: false },
      height: 320,
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
      categories: categories.length ? categories : ['00:00'],
      axisBorder: { show: false },
    },
    yaxis: {
      title: { text: 'Current (Amps)' },
      min: 0,
    },
    tooltip: {
      theme: 'dark',
    },
  };

  const seriescolumnchart = [
    { name: 'Phase Current (Ip)', data: phaseData.length ? phaseData : [0] },
    { name: 'Neutral Current (In)', data: neutralData.length ? neutralData : [0] },
    { name: '|Δ| Disparity (A)', data: deltaData.length ? deltaData : [0] },
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
              Real-time phase vs. neutral current telemetry ($|I_p - I_n|$)
            </Typography>
          </Box>
        </Stack>
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="line" height={320} />
      </CardContent>
    </Card>
  );
};

export default CurrentDisparityChart;
