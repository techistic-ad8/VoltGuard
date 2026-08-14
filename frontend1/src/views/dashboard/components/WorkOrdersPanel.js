import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Grid,
} from '@mui/material';
import { IconTools, IconUserPlus, IconCheck, IconShieldCheck } from '@tabler/icons-react';

const WorkOrdersPanel = ({ workOrders, onRefresh }) => {
  const activeWorkOrders = workOrders.filter(w => w.status !== 'RESOLVED');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWoId, setSelectedWoId] = useState(null);
  const [engineer, setEngineer] = useState('Engineer Sarah Chen');

  const openAssignModal = (id) => {
    setSelectedWoId(id);
    setDialogOpen(true);
  };

  const handleConfirmAssign = async () => {
    if (!selectedWoId) return;
    try {
      const res = await fetch(`/api/work-orders/${selectedWoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedEngineer: engineer, status: 'OPEN' }),
      });
      if (res.ok) {
        setDialogOpen(false);
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error('Assign error:', err);
    }
  };

  const handleResolve = async (id) => {
    try {
      const res = await fetch(`/api/work-orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'RESOLVED' }),
      });
      if (res.ok && onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Resolve error:', err);
    }
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: '12px', height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconTools size={20} color="#dc2626" />
            <Typography variant="h5" fontWeight={700} color="#0f172a">
              Active Work Orders
            </Typography>
          </Box>
          <Chip label={`${activeWorkOrders.length} OPEN`} color="error" size="small" sx={{ fontWeight: 800 }} />
        </Box>

        <Stack spacing={2} sx={{ maxHeight: 380, overflowY: 'auto' }}>
          {activeWorkOrders.length === 0 ? (
            <Box textAlign="center" py={4} color="text.secondary">
              <IconShieldCheck size={40} color="#059669" style={{ opacity: 0.8 }} />
              <Typography variant="body2" mt={1}>
                All clear — no active tampering tickets.
              </Typography>
            </Box>
          ) : (
            [...activeWorkOrders].reverse().map(wo => (
              <Box
                key={wo.id}
                sx={{
                  p: 2,
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  borderLeft: '4px solid #dc2626',
                  backgroundColor: '#f8fafc',
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                      Ticket #{wo.id}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ fontFamily: 'monospace' }}>
                      {new Date(wo.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Chip label={wo.status} color="warning" size="small" sx={{ fontWeight: 800, fontSize: '10px' }} />
                </Box>

                <Grid container spacing={1} sx={{ p: 1, backgroundColor: '#ffffff', borderRadius: '6px', mb: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" fontWeight={700} display="block">
                      METER
                    </Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                      {wo.meterId}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary" fontWeight={700} display="block">
                      SUBSTATION
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {wo.substation}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary" fontWeight={700} display="block">
                      ASSIGNED OPERATOR
                    </Typography>
                    <Typography variant="body2" fontWeight={700} color="#2563eb">
                      {wo.assignedEngineer}
                    </Typography>
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button
                    size="small"
                    variant="outlined"
                    color="warning"
                    startIcon={<IconUserPlus size={14} />}
                    onClick={() => openAssignModal(wo.id)}
                    sx={{ textTransform: 'none', fontSize: '11px' }}
                  >
                    Assign
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    startIcon={<IconCheck size={14} />}
                    onClick={() => handleResolve(wo.id)}
                    sx={{ textTransform: 'none', fontSize: '11px' }}
                  >
                    Resolve
                  </Button>
                </Stack>
              </Box>
            ))
          )}
        </Stack>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
          <DialogTitle fontWeight={700}>Assign Substation Engineer</DialogTitle>
          <DialogContent>
            <TextField
              select
              fullWidth
              size="small"
              label="Select Engineer"
              value={engineer}
              onChange={e => setEngineer(e.target.value)}
              sx={{ mt: 1 }}
            >
              <MenuItem value="Engineer Sarah Chen">Engineer Sarah Chen (Grid Specialist)</MenuItem>
              <MenuItem value="Engineer Marcus Singh">Engineer Marcus Singh (Substation Lead)</MenuItem>
              <MenuItem value="Engineer Dev Patel">Engineer Dev Patel (Hardware Bypass Tech)</MenuItem>
              <MenuItem value="Engineer Elena Rostova">Engineer Elena Rostova (Field Inspector)</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleConfirmAssign} color="primary">
              Assign & Dispatch
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default WorkOrdersPanel;
