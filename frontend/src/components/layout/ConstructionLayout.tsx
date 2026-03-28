import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider,
  Tooltip,
  Badge,
  Avatar,
  Button,
} from '@mui/material';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useUtilityStore } from '../../utilities/store';

const DRAWER_WIDTH = 240;

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', path: '/construction/dashboard', icon: '📊' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'CRM / Job Intake', path: '/construction/crm', icon: '💼' },
      { label: 'Bidding Engine', path: '/construction/bidding', icon: '📋' },
      { label: 'Projects', path: '/construction/projects', icon: '🗂️' },
      { label: 'Blueprints', path: '/construction/blueprints', icon: '📐' },
      { label: 'Materials', path: '/construction/materials', icon: '📦' },
    ],
  },
  {
    label: 'Team & Finance',
    items: [
      { label: 'Workforce', path: '/construction/workforce', icon: '👷' },
      { label: 'Payroll', path: '/construction/payroll', icon: '💵' },
    ],
  },
  {
    label: 'Legal',
    items: [
      { label: 'Contracts', path: '/construction/contracts', icon: '⚖️' },
    ],
  },
];

// Flat list used for title resolution
const allNavItems: NavItem[] = navGroups.flatMap((g) => g.items);

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Brand header */}
      <Box
        sx={{
          px: 2,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        <Typography fontSize={28} lineHeight={1}>🏗️</Typography>
        <Box>
          <Typography variant="subtitle1" fontWeight={800} lineHeight={1.2}>
            WoodwardStudio
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Construction Portal
          </Typography>
        </Box>
      </Box>

      <Divider />

      <List sx={{ flex: 1, pt: 1, overflowY: 'auto' }}>
        {navGroups.map((group, gi) => (
          <React.Fragment key={group.label}>
            {gi > 0 && <Divider sx={{ my: 0.5 }} />}
            <Typography
              variant="caption"
              sx={{
                px: 2,
                pt: 1.5,
                pb: 0.5,
                display: 'block',
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: 'uppercase',
                color: 'text.disabled',
                fontSize: 10,
              }}
            >
              {group.label}
            </Typography>
            {group.items.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/construction/dashboard' &&
                  location.pathname.startsWith(item.path));

              return (
                <ListItemButton
                  key={item.path}
                  component={NavLink}
                  to={item.path}
                  onClick={onClose}
                  sx={{
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 1.5,
                    color: isActive ? 'primary.main' : 'text.secondary',
                    bgcolor: isActive
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(144,202,249,0.12)'
                        : 'rgba(25,118,210,0.08)'
                      : 'transparent',
                    '&:hover': {
                      bgcolor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.08)'
                          : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      fontSize: 18,
                      color: isActive ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    <Typography fontSize={18}>{item.icon}</Typography>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: isActive ? 700 : 400,
                    }}
                  />
                </ListItemButton>
              );
            })}
          </React.Fragment>
        ))}
      </List>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.disabled">
          © 2024 WoodwardStudio
        </Typography>
      </Box>
    </Box>
  );
}

function getModuleTitle(pathname: string): string {
  const item = allNavItems.find(
    (n) => pathname === n.path || (n.path !== '/construction/dashboard' && pathname.startsWith(n.path))
  );
  return item?.label ?? 'WoodwardStudio';
}

export function ConstructionLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { colorMode, setColorMode } = useUtilityStore();

  const moduleTitle = getModuleTitle(location.pathname);

  return (
    <Box sx={{ display: 'flex', height: '100dvh', bgcolor: 'background.default' }}>
      {/* Permanent sidebar - desktop */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <SidebarContent />
        </Drawer>
      )}

      {/* Temporary drawer - mobile */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
          ModalProps={{ keepMounted: true }}
        >
          <SidebarContent onClose={() => setMobileOpen(false)} />
        </Drawer>
      )}

      {/* Main content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            color: 'text.primary',
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                edge="start"
                onClick={() => setMobileOpen(true)}
                sx={{ mr: 1 }}
                aria-label="open menu"
              >
                <Typography fontSize={20}>☰</Typography>
              </IconButton>
            )}
            <Typography variant="h6" fontWeight={700} sx={{ flex: 1 }}>
              {moduleTitle}
            </Typography>

            {/* Search shortcut */}
            <Tooltip title="Global search (Dashboard)">
              <IconButton
                onClick={() => navigate('/construction/dashboard')}
                aria-label="global search"
                sx={{ mx: 0.5 }}
              >
                <Typography fontSize={18}>🔍</Typography>
              </IconButton>
            </Tooltip>

            {/* Ask Agent */}
            <Tooltip title="Ask Agent">
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/construction/dashboard')}
                startIcon={<Typography fontSize={16} lineHeight={1}>🤖</Typography>}
                sx={{
                  mx: 0.5,
                  borderRadius: 2,
                  fontSize: 13,
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'inline-flex' },
                  textTransform: 'none',
                }}
              >
                Ask Agent
              </Button>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton aria-label="notifications" sx={{ mx: 0.5 }}>
                <Badge badgeContent={3} color="error" overlap="circular">
                  <Typography fontSize={20}>🔔</Typography>
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Dark mode toggle */}
            <Tooltip title={colorMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
              <IconButton
                onClick={() => setColorMode(colorMode === 'dark' ? 'light' : 'dark')}
                aria-label="toggle dark mode"
                sx={{ mx: 0.5 }}
              >
                <Typography fontSize={20}>{colorMode === 'dark' ? '☀️' : '🌙'}</Typography>
              </IconButton>
            </Tooltip>

            {/* User avatar */}
            <Tooltip title="Account">
              <Avatar
                onClick={() => {/* account menu placeholder */}}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click(); }}
                sx={{
                  width: 32,
                  height: 32,
                  ml: 0.5,
                  bgcolor: 'primary.main',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                WS
              </Avatar>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: 'auto',
            p: { xs: 2, sm: 3 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default ConstructionLayout;
