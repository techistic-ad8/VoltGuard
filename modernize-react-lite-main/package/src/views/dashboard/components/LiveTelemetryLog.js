import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
} from '@mui/material';

const LiveTelemetryLog = ({ readings }) => {
  const recentReadings = [...readings].reverse().slice(0, 15);

  return (
    <Card variant="outlined" sx={{ borderRadius: '12px', height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h5" fontWeight={700} color="#0f172a">
              Live Telemetry Feed
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Real-time incoming grid telemetry broadcast stream
            </Typography>
          </Box>
          <Chip label={`${readings.length} ENTRIES`} color="success" size="small" sx={{ fontWeight: 800 }} />
        </Box>

        <TableContainer sx={{ maxHeight: 320 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Meter</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Energy (kWh)</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Voltage</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Ip (A)</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>In (A)</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>|Δ| Current</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentReadings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#64748b' }}>
                    Awaiting telemetry stream...
                  </TableCell>
                </TableRow>
              ) : (
                recentReadings.map(r => {
                  const delta = Math.abs(r.phaseCurrent - r.neutralCurrent);
                  const isTampered = delta > 2.0;

                  return (
                    <TableRow key={r.id} hover>
                      <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{r.meterId}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', color: '#64748b' }}>
                        {new Date(r.timestamp).toLocaleTimeString()}
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{r.activeEnergy.toFixed(3)}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{r.voltage.toFixed(1)} V</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{r.phaseCurrent.toFixed(2)}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace' }}>{r.neutralCurrent.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${delta.toFixed(2)} A ${isTampered ? '⚠' : ''}`}
                          color={isTampered ? 'error' : 'default'}
                          size="small"
                          sx={{
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            fontSize: '11px',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default LiveTelemetryLog;
