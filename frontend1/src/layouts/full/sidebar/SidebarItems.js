import React from "react";
import { useLocation, useNavigate } from 'react-router';
import { 
  Box, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Tooltip, 
  Divider,
  Chip
} from "@mui/material";
import Menuitems from "./MenuItems";
import Upgrade from "./Upgrade";
import Logo from "../shared/logo/Logo";

const SidebarItems = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname + location.hash;

  return (
    <Box sx={{ px: isCollapsed ? 1.5 : 2, py: 1, overflowX: 'hidden' }}>
      {/* Logo Header & Collapse Button */}
      <Box sx={{ mb: 2, display: 'flex', flexDirection: isCollapsed ? 'column' : 'row', alignItems: 'center' }}>
        <Logo isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      </Box>

      {/* Menu List */}
      <List component="nav" disablePadding>
        {Menuitems.map((item, index) => {
          if (item.subheader) {
            if (isCollapsed) {
              return <Divider key={index} sx={{ my: 1.5, borderColor: 'rgba(0, 0, 0, 0.08)' }} />;
            }
            return (
              <Typography
                key={index}
                variant="caption"
                sx={{
                  display: 'block',
                  fontWeight: 700,
                  color: 'text.secondary',
                  mt: 2.5,
                  mb: 1,
                  px: 1.5,
                  letterSpacing: 0.8,
                  fontSize: 10
                }}
              >
                {item.subheader}
              </Typography>
            );
          }

          const Icon = item.icon;
          const isActive = currentPath === item.href || (location.pathname === item.href);

          const navButton = (
            <ListItemButton
              key={item.id || index}
              selected={isActive}
              onClick={() => {
                if (item.external) {
                  window.open(item.href, '_blank');
                } else {
                  navigate(item.href);
                }
              }}
              sx={{
                mb: 0.8,
                borderRadius: '8px',
                px: isCollapsed ? 1.5 : 2,
                py: 1,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                bgcolor: isActive ? 'primary.main' : 'transparent',
                color: isActive ? '#ffffff' : 'text.primary',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: '#ffffff',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: '#ffffff',
                  },
                },
                '&:hover': {
                  bgcolor: isActive ? 'primary.main' : 'rgba(37, 99, 235, 0.08)',
                  color: isActive ? '#ffffff' : 'primary.main',
                  '& .MuiListItemIcon-root': {
                    color: isActive ? '#ffffff' : 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: isCollapsed ? 0 : 36,
                  color: isActive ? '#ffffff' : 'text.secondary',
                  justifyContent: 'center',
                }}
              >
                <Icon size={20} stroke={1.8} />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                    whiteSpace: 'nowrap',
                  }}
                />
              )}
              {!isCollapsed && item.chip && (
                <Chip
                  label={item.chip}
                  size="small"
                  color="secondary"
                  sx={{ height: 20, fontSize: 10, fontWeight: 700 }}
                />
              )}
            </ListItemButton>
          );

          if (isCollapsed) {
            return (
              <Tooltip key={item.id || index} title={item.title} placement="right" arrow>
                <Box>{navButton}</Box>
              </Tooltip>
            );
          }

          return navButton;
        })}
      </List>

      {/* Security Status Box */}
      <Box sx={{ mt: 2 }}>
        <Upgrade isCollapsed={isCollapsed} />
      </Box>
    </Box>
  );
};

export default SidebarItems;

