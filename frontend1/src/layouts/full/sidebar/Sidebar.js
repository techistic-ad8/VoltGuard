import { useMediaQuery, Box, Drawer } from '@mui/material';
import SidebarItems from './SidebarItems';
import Scrollbar from "../../../components/custom-scroll/Scrollbar";
import Upgrade from './Upgrade'

const Sidebar = (props) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const isCollapsed = !props.isSidebarOpen;
  const sidebarWidth = isCollapsed ? '80px' : '270px';

  if (lgUp) {
    return (
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Drawer
          anchor="left"
          open={true}
          variant="permanent"
          slotProps={{
            paper: {
              sx: {
                width: sidebarWidth,
                boxSizing: 'border-box',
                top: '0px',
                transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                overflowX: 'hidden',
                borderRight: '1px solid rgba(0, 0, 0, 0.08)',
              },
            }
          }}
        >
          <Scrollbar sx={{ height: "100%" }}>
            <SidebarItems isCollapsed={isCollapsed} toggleSidebar={props.toggleSidebar} />
          </Scrollbar>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={props.isMobileSidebarOpen}
      onClose={props.onSidebarClose}
      variant="temporary"
      slotProps={{
        paper: {
          sx: {
            width: '270px',
            boxShadow: (theme) => theme.shadows[8],
          },
        }
      }}
    >
      <Scrollbar sx={{ height: "100%" }}>
        <SidebarItems isCollapsed={false} />
      </Scrollbar>
    </Drawer>
  );
};
export default Sidebar;
