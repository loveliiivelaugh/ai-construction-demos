import React from "react";
import { AppBar, Box, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";

const TOP_BAR_H = 64;
const BOTTOM_NAV_H = 84;

export function AppShell({
  title = "Starter App",
  topRight,
  bottomNav,
  children,
}: {
  title?: string;
  topRight?: React.ReactNode;
  bottomNav?: React.ReactNode;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        height: "100dvh",
        width: "100vw",
        bgcolor: "background.default",
        color: "text.primary",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          height: TOP_BAR_H,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar sx={{ minHeight: TOP_BAR_H, display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontWeight: 800, letterSpacing: 0.2 }}>{title}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>{topRight}</Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flex: 1,
          pt: `${TOP_BAR_H}px`,
          pb:
            isMobile && bottomNav
              ? `calc(${BOTTOM_NAV_H}px + env(safe-area-inset-bottom) + 16px)`
              : 2,
          px: { xs: 2, sm: 3, md: 4 },
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Box sx={{ maxWidth: 1100, mx: "auto", minHeight: "100%", py: { xs: 2, sm: 3 } }}>
          {children}
        </Box>
      </Box>

      {/* {bottomNav} */}

      {
      // isMobile && 
      bottomNav && (
        <Box
          sx={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            height: `calc(${BOTTOM_NAV_H}px + env(safe-area-inset-bottom))`,
            pb: "env(safe-area-inset-bottom)",
            px: 2,
            bgcolor: "transparent",
            pointerEvents: "none",
          }}
        >
          <Box sx={{ height: BOTTOM_NAV_H, pointerEvents: "auto" }}>{bottomNav}</Box>
        </Box>
      )}
    </Box>
  );
}
