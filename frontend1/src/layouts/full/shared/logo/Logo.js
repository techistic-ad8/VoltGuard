import React from "react";
import { Link } from "react-router";
import { Box, Typography, IconButton } from "@mui/material";
import { IconShieldCheck, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

const Logo = ({ isCollapsed, toggleSidebar }) => {
  return (
    <Box 
      sx={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: isCollapsed ? "center" : "space-between", 
        width: "100%",
        py: 0.5,
      }}
    >
      <Link 
        to="/" 
        style={{ 
          display: "flex", 
          alignItems: "center", 
          textDecoration: "none",
          gap: "10px"
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#3772ff",
            flexShrink: 0,
          }}
        >
          <IconShieldCheck size={28} stroke={2} color="#3772ff" />
        </Box>
        {!isCollapsed && (
          <Box sx={{ whiteSpace: 'nowrap' }}>
            <Typography variant="h6" fontWeight={700} color="#3772ff" lineHeight={1} fontSize={17}>
              VoltGuard Security
            </Typography>
            <Typography variant="caption" color="textSecondary" fontWeight={700} sx={{ letterSpacing: 0.8, fontSize: 8.5, display: 'block', mt: 0.3 }}>
              POWER SECURITY
            </Typography>
          </Box>
        )}
      </Link>

      {toggleSidebar && !isCollapsed && (
        <IconButton 
          onClick={toggleSidebar} 
          size="small" 
          sx={{ 
            bgcolor: 'rgba(0, 0, 0, 0.04)', 
            '&:hover': { bgcolor: 'rgba(55, 114, 255, 0.1)', color: '#3772ff' },
            borderRadius: '8px',
            ml: 1
          }}
          title="Minimize Sidebar"
        >
          <IconChevronLeft size={18} />
        </IconButton>
      )}
      {toggleSidebar && isCollapsed && (
        <IconButton 
          onClick={toggleSidebar} 
          size="small" 
          sx={{ 
            bgcolor: 'rgba(0, 0, 0, 0.04)', 
            '&:hover': { bgcolor: 'rgba(55, 114, 255, 0.1)', color: '#3772ff' },
            borderRadius: '8px',
            mt: 1
          }}
          title="Expand Sidebar"
        >
          <IconChevronRight size={18} />
        </IconButton>
      )}
    </Box>
  );
};

export default Logo;
