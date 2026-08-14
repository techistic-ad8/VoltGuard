import React, { useState } from 'react';
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
  Button,
  TextField,
  InputAdornment,
  Box,
} from '@mui/material';
import { IconSearch, IconAdjustmentsHorizontal } from '@tabler/icons-react';

const MeterInventoryTable = ({ meters, onSelectMeter }) => {
  const [search, setSearch] = useState('');

  const filteredMeters = meters.filter(
    m =>
      m.meterId.toLowerCase().includes(search.toLowerCase()) ||
      m.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card variant="outlined" sx={{ borderRadius: '12px', height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
          <Box>
            <Typography variant="h5" fontWeight={700} color="#0f172a">
              Meter Inventory
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Registered smart meters and baseline kWh parameters
            </Typography>
          </Box>
          <TextField
            size="small"
            placeholder="Search badge ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={16} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 200 }}
          />
        </Box>

        <TableContainer sx={{ maxHeight: 320 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Badge ID</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Daily Baseline</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMeters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#64748b' }}>
                    No matching meters found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMeters.map(m => (
                  <TableRow key={m.id} hover>
                    <TableCell sx={{ fontWeight: 700, color: '#2563eb', fontFamily: 'monospace' }}>
                      {m.meterId}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={m.status}
                        color={m.status === 'FLAGGED_TAMPERED' ? 'error' : 'success'}
                        size="small"
                        sx={{ fontWeight: 800, fontSize: '10px' }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace' }}>{m.baselineKwh.toFixed(3)} kWh</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<IconAdjustmentsHorizontal size={14} />}
                        onClick={() => onSelectMeter(m.meterId)}
                        sx={{ fontSize: '11px', textTransform: 'none' }}
                      >
                        Simulate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default MeterInventoryTable;
