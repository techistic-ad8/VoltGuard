import { Link } from "react-router";
import { styled, Box, Typography } from "@mui/material";
import { IconShieldAlert } from "@tabler/icons-react";

const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "100%",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
}));

const Logo = () => {
  return (
    <LinkStyled to="/">
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "8px",
          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          mr: 1.5,
          boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
        }}
      >
        <IconShieldAlert size={22} />
      </Box>
      <Box>
        <Typography variant="h6" fontWeight={800} color="#0f172a" lineHeight={1}>
          <span style={{ color: "#2563eb" }}>Volt</span>Guard
        </Typography>
        <Typography variant="caption" color="textSecondary" fontWeight={700} sx={{ letterSpacing: 0.8, fontSize: 9 }}>
          GOVT POWER SECURITY
        </Typography>
      </Box>
    </LinkStyled>
  );
};

export default Logo;
