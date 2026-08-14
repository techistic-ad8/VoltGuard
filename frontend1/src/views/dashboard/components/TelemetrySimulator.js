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
  Stack,
  Chip
} from '@mui/material';
import { IconAlertTriangle, IconSend, IconCpu } from '@tabler/icons-react';

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
    <Card 
      variant="outlined" 
      sx={{ 
        borderRadius: '16px', 
        height: '100%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        border: '1px solid rgba(0, 0, 0, 0.08)' 
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header Section */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2.5}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
              <IconCpu size={22} color="#2563eb" />
              <Typography variant="h5" fontWeight={700} color="#0f172a">
                Telemetry Simulator
              </Typography>
            </Stack>
            <Typography variant="subtitle2" color="textSecondary">
              Broadcast live meter telemetry to Spring Boot backend
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            color="warning"
            startIcon={<IconAlertTriangle size={16} />}
            onClick={loadTamperPreset}
            sx={{ 
              fontWeight: 700, 
              textTransform: 'none',
              borderRadius: '8px',
              px: 1.5,
              whiteSpace: 'nowrap'
            }}
          >
            Auto-Tamper
          </Button>
        </Stack>

        <form onSubmit={handleSubmitPing}>
          <Grid container spacing={2}>
            {/* Target Meter Selection */}
            <Grid item xs={12}>
              <Typography variant="caption" fontWeight={700} color="textSecondary" sx={{ mb: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Target Meter Badge ID
              </Typography>
              <TextField
                select
                fullWidth
                size="medium"
                value={selectedMeterId}
                onChange={e => setSelectedMeterId(e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: '10px' }
                }}
              >
                {meters.map(m => (
                  <MenuItem key={m.id} value={m.meterId}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                      <Typography variant="body2" fontWeight={600}>{m.meterId}</Typography>
                      <Chip 
                        label={m.status} 
                        size="small" 
                        color={m.status === 'ACTIVE' ? 'success' : 'error'}
                        sx={{ height: 20, fontSize: 10, fontWeight: 700 }}
                      />
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Input Row 1: Voltage & Energy */}
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" fontWeight={700} color="textSecondary" sx={{ mb: 0.5, display: 'block' }}>
                Voltage (V)
              </Typography>
              <TextField
                fullWidth
                size="medium"
                type="number"
                value={voltage}
                onChange={e => setVoltage(e.target.value)}
                inputProps={{ step: '0.1' }}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" fontWeight={700} color="textSecondary" sx={{ mb: 0.5, display: 'block' }}>
                Active Energy (kWh)
              </Typography>
              <TextField
                fullWidth
                size="medium"
                type="number"
                value={energy}
                onChange={e => setEnergy(e.target.value)}
                inputProps={{ step: '0.01' }}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Grid>

            {/* Input Row 2: Phase Current & Neutral Current */}
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" fontWeight={700} color="textSecondary" sx={{ mb: 0.5, display: 'block' }}>
                Phase Current Ip (A)
              </Typography>
              <TextField
                fullWidth
                size="medium"
                type="number"
                value={phase}
                onChange={e => setPhase(e.target.value)}
                inputProps={{ step: '0.01' }}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" fontWeight={700} color="textSecondary" sx={{ mb: 0.5, display: 'block' }}>
                Neutral Current In (A)
              </Typography>
              <TextField
                fullWidth
                size="medium"
                type="number"
                value={neutral}
                onChange={e => setNeutral(e.target.value)}
                inputProps={{ step: '0.01' }}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Grid>

            {/* Action Submit Button */}
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                startIcon={<IconSend size={20} />}
                sx={{
                  py: 1.4,
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: 15,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
                    boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
                  },
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
