import React from 'react';
import { Card, CardContent, Typography, Box, Grid, Chip } from '@mui/material';
import { IconCpu, IconAlertTriangle, IconBolt, IconTools } from '@tabler/icons-react';

const TamperAlertSummary = ({ meters, readings, workOrders }) => {
  const tamperedCount = meters.filter(m => m.status === 'FLAGGED_TAMPERED').length;
  const activeWorkOrders = workOrders.filter(w => w.status !== 'RESOLVED').length;
  const avgVoltage = readings.length > 0
    ? (readings.reduce((sum, r) => sum + r.voltage, 0) / readings.length).toFixed(1)
    : '230.0';

  const stats = [
    {
      title: 'Monitored Meters',
      value: meters.length,
      icon: <IconCpu size={24} color="#2563eb" />,
      bgColor: '#eff6ff',
      tag: 'ACTIVE',
      tagColor: 'success',
    },
    {
      title: 'Tampered / Flagged',
      value: tamperedCount,
      icon: <IconAlertTriangle size={24} color="#dc2626" />,
      bgColor: '#fef2f2',
      tag: 'CRITICAL',
      tagColor: 'error',
      borderLeft: '4px solid #dc2626',
    },
    {
      title: 'Average Grid Voltage',
      value: `${avgVoltage} V`,
      icon: <IconBolt size={24} color="#059669" />,
      bgColor: '#ecfdf5',
      tag: 'STABLE',
      tagColor: 'success',
    },
    {
      title: 'Active Work Orders',
      value: activeWorkOrders,
      icon: <IconTools size={24} color="#7c3aed" />,
      bgColor: '#f5f3ff',
      tag: `${activeWorkOrders} OPEN`,
      tagColor: 'warning',
    },
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((item, index) => (
        <Grid key={index} item xs={12} sm={6} lg={3}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: '12px',
              borderLeft: item.borderLeft || '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '10px',
                    backgroundColor: item.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </Box>
                <Chip label={item.tag} color={item.tagColor} size="small" sx={{ fontWeight: 700, fontSize: '10px' }} />
              </Box>
              <Typography variant="h4" fontWeight={800} color="#0f172a">
                {item.value}
              </Typography>
              <Typography variant="caption" color="textSecondary" fontWeight={600}>
                {item.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TamperAlertSummary;
