import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useConstructionStore } from '../../../../utilities/store/constructionStore';

const MotionCard = motion(Card);

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

const recentActivity = [
  { time: '2h ago', text: 'Bid generated for Kitchen Remodel', icon: '📋' },
  { time: '4h ago', text: 'Dana Park logged 8 hours on electrical rough-in', icon: '⚡' },
  { time: '6h ago', text: 'Porcelain tiles order placed with TileWorld Pro', icon: '📦' },
  { time: '1d ago', text: 'Contract sent to client for Kitchen Remodel', icon: '⚖️' },
  { time: '1d ago', text: 'New job added: Primary Bathroom Renovation', icon: '💼' },
  { time: '2d ago', text: 'Cedar Deck project kicked off', icon: '🏗️' },
];

function KpiCard({
  label,
  value,
  icon,
  color,
  index,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  index: number;
}) {
  return (
    <MotionCard
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {label}
          </Typography>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: `${color}.50`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" fontWeight={800} color={`${color}.main`}>
          {value}
        </Typography>
      </CardContent>
    </MotionCard>
  );
}

export function DashboardPage() {
  const { jobs, projects, bids, workers } = useConstructionStore();

  const totalRevenue = bids.reduce((sum, b) => sum + b.estimatedCost, 0);
  const activeJobs = jobs.filter((j) => j.status === 'active').length;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>
          Executive Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time overview of WoodwardStudio construction operations
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Projects', value: projects.length, icon: '🏗️', color: 'primary' },
          { label: 'Active Jobs', value: activeJobs, icon: '💼', color: 'success' },
          {
            label: 'Total Revenue',
            value: `$${(totalRevenue / 1000).toFixed(0)}k`,
            icon: '💵',
            color: 'warning',
          },
          { label: 'Crew Members', value: workers.length, icon: '👷', color: 'info' },
        ].map((kpi, i) => (
          <Grid item xs={12} sm={6} md={3} key={kpi.label}>
            <KpiCard {...kpi} index={i} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {/* Project Progress */}
        <Grid item xs={12} md={6}>
          <MotionCard
            custom={4}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Project Progress
              </Typography>
              {projects.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No active projects.
                </Typography>
              )}
              {projects.map((proj) => (
                <Box key={proj.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {proj.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {proj.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={proj.progress}
                    sx={{ borderRadius: 4, height: 8 }}
                  />
                  <Chip
                    label={proj.status}
                    size="small"
                    color={proj.status === 'completed' ? 'success' : 'primary'}
                    sx={{ mt: 0.5, fontSize: 11 }}
                  />
                </Box>
              ))}
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Budget Overview */}
        <Grid item xs={12} md={6}>
          <MotionCard
            custom={5}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Budget Overview
              </Typography>
              {jobs.map((job) => {
                const bid = bids.find((b) => b.jobId === job.id);
                const actual = bid?.estimatedCost ?? 0;
                const pct = job.budget > 0 ? Math.min((actual / job.budget) * 100, 100) : 0;
                return (
                  <Box key={job.id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 180 }}>
                        {job.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${(actual / 1000).toFixed(0)}k / ${(job.budget / 1000).toFixed(0)}k
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={pct}
                      color={pct > 95 ? 'error' : pct > 80 ? 'warning' : 'success'}
                      sx={{ borderRadius: 4, height: 6 }}
                    />
                  </Box>
                );
              })}
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <MotionCard
            custom={6}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider' }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                Recent Activity
              </Typography>
              <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                <List dense disablePadding>
                  {recentActivity.map((ev, i) => (
                    <React.Fragment key={i}>
                      <ListItem>
                        <Box sx={{ mr: 1.5, fontSize: 18 }}>{ev.icon}</Box>
                        <ListItemText
                          primary={ev.text}
                          secondary={ev.time}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                      {i < recentActivity.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardPage;
