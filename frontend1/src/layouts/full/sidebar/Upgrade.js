import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { IconShieldCheck } from '@tabler/icons-react';

const Upgrade = ({ isCollapsed }) => {
    if (isCollapsed) {
        return (
            <Box display="flex" justifyContent="center" my={2}>
                <Chip 
                    icon={<IconShieldCheck size={16} />}
                    label="OK"
                    color="success" 
                    size="small" 
                    sx={{ width: 44, height: 26, fontSize: 10, fontWeight: 700, px: 0, justifyContent: 'center' }} 
                />
            </Box>
        );
    }
    return (
        <Box
            display={'flex'}
            flexDirection="column"
            gap={1}
            sx={{ my: 3, p: 2.5, bgcolor: 'primary.light', borderRadius: '12px', border: '1px solid rgba(37, 99, 235, 0.2)' }}
        >
            <Box display="flex" alignItems="center" gap={1}>
                <IconShieldCheck size={20} color="#2563eb" />
                <Typography variant="h6" fontSize={14} fontWeight={700} color="primary.main">
                    VoltGuard Security
                </Typography>
            </Box>
            <Typography variant="caption" color="textSecondary" lineHeight={1.3}>
                Substation Tamper Detection & Telemetry Engine
            </Typography>
            <Chip 
                label="System Active" 
                color="success" 
                size="small" 
                sx={{ mt: 1, height: 22, fontSize: 11, fontWeight: 700, width: 'fit-content' }} 
            />
        </Box>
    );
};

export default Upgrade;