'use client';
import { Box, Typography } from "@mui/material";
import { Link } from "react-router";

const Footer = () => {
    return (
        <Box sx={{ pt: 6, pb: 3, textAlign: "center" }}>
            <Typography variant="body2" color="textSecondary">
                © {new Date().getFullYear()} VoltGuard Smart Energy Surveillance System. Power Grid Security Division.
            </Typography>
        </Box>
    );
};

export default Footer;
