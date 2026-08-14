import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import { IconAlertTriangle, IconSend } from '@tabler/icons-react';

const TelemetrySimulator = ({ meters, selectedMeterId, setSelectedMeterId, onPingSuccess }) => {
  const [voltage, setVoltage] = useState('230.0');
  const [energy, setEnergy] = useState('5.24');
  const [phase, setPhase] = useState('5.0');
  const [neutral, setNeutral] = useState('5.0');
  const [snackbar, setSnackbar] = useState({ open: false, msg: '', severity: 'info' });

  const loadTamperPreset = () => {
    if (!selectedMeterId && meters.length > 0) {
      setSelectedMeterId(meters[0].meterId);
    }
    setVoltage('228.4');
    setEnergy('1.85');
    setPhase('0.45');
    setNeutral('4.80');
    setSnackbar({ open: true, msg: 'Tamper preset loaded (Disparity > 2A)', severity: 'warning' });
  };

  const handleSubmitPing = async (e) => {
    e.preventDefault();
    if (!selectedMeterId) {
      setSnackbar({ open: true, msg: 'Please select a meter badge ID', severity: 'error' });
      return;
    }

    try {
      const res = await fetch('/api/meters/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meterId: selectedMeterId,
          activeEnergy: parseFloat(energy),
          voltage: parseFloat(voltage),
          phaseCurrent: parseFloat(phase),
          neutralCurrent: parseFloat(neutral),
        }),
      });

      if (res.ok) {
        setSnackbar({ open: true, msg: 'Ping broadcasted successfully!', severity: 'success' });
        setEnergy((parseFloat(energy) + 0.12).toFixed(2));
        if (onPingSuccess) onPingSuccess();
      } else {
        setSnackbar({ open: true, msg: 'Server rejected the ping', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, msg: 'Cannot reach backend server', severity: 'error' });
    }
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: '12px', height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h5" fontWeight={700} color="#0f172a">
              Telemetry Simulator
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Broadcast simulated telemetry to Spring Boot backend
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            color="warning"
            startIcon={<IconAlertTriangle size={16} />}
            onClick={loadTamperPreset}
            sx={{ fontWeight: 700, textTransform: 'none' }}
          >
            Auto-Tamper
          </Button>
        </Box>

        <form onSubmit={handleSubmitPing}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                size="small"
                label="Select Meter Badge ID"
                value={selectedMeterId}
                onChange={e => setSelectedMeterId(e.target.value)}
                required
              >
                {meters.map(m => (
                  <MenuItem key={m.id} value={m.meterId}>
                    {m.meterId} ({m.status})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Voltage (V)"
                value={voltage}
                onChange={e => setVoltage(e.target.value)}
                inputProps={{ step: '0.1' }}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Energy (kWh)"
                value={energy}
                onChange={e => setEnergy(e.target.value)}
                inputProps={{ step: '0.01' }}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Phase Current Ip (A)"
                value={phase}
                onChange={e => setPhase(e.target.value)}
                inputProps={{ step: '0.01' }}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Neutral Current In (A)"
                value={neutral}
                onChange={e => setNeutral(e.target.value)}
                inputProps={{ step: '0.01' }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                startIcon={<IconSend size={18} />}
                sx={{
                  mt: 1,
                  py: 1,
                  fontWeight: 700,
                  backgroundColor: '#2563eb',
                  '&:hover': { backgroundColor: '#1d4ed8' },
                }}
              >
                Broadcast Telemetry Ping
              </Button>
            </Grid>
          </Grid>
        </form>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3500}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.msg}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default TelemetrySimulator;
