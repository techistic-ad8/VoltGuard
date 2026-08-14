import React, { useState } from "react";
import { styled, Container, Box } from '@mui/material';



import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';
import { Outlet } from "react-router";
import Footer from "./footer/Footer";

const MainWrapper = styled('div')(() => ({
  display: 'flex',
  //minHeight: '100vh',
  width: '100%',
}));

const PageWrapper = styled('div')(() => ({
  display: 'flex',
  flexGrow: 1,
 // paddingBottom: '60px',
  flexDirection: 'column',
  zIndex: 1,
  backgroundColor: 'transparent',
}));

const FullLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <>
      <MainWrapper className='mainwrapper'>
        {/* Sidebar */}
        <Sidebar 
          isSidebarOpen={isSidebarOpen}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={() => setMobileSidebarOpen(false)}
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
        />

        {/* Main Page Content (Header Removed) */}
        <PageWrapper className="page-wrapper">
          <Container 
            sx={{
              paddingTop: "24px",
              paddingBottom: "24px",
              maxWidth: '1400px',
            }}
          >
            <Box sx={{ minHeight: 'calc(100vh - 120px)' }}>
              <Outlet />
            </Box>
          </Container>
          <Footer />
        </PageWrapper>
      </MainWrapper>
    </>
  );
};

export default FullLayout;
