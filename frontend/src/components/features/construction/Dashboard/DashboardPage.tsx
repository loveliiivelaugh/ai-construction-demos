import React, { useCallback, useRef, useState, useDeferredValue } from 'react';
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
  InputAdornment,
  TextField,
  ListItemButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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

interface SearchResult {
  id: string;
  category: string;
  icon: string;
  title: string;
  subtitle: string;
  path: string;
}

interface SearchEntityConfig<T> {
  items: T[];
  category: string;
  icon: string;
  path: string;
  fields: (item: T) => string[];
  subtitle: (item: T) => string;
  getId: (item: T) => string;
  getTitle: (item: T) => string;
}

function searchEntities<T>(q: string, config: SearchEntityConfig<T>): SearchResult[] {
  return config.items
    .filter((item) => config.fields(item).some((f) => f.toLowerCase().includes(q)))
    .map((item) => ({
      id: config.getId(item),
      category: config.category,
      icon: config.icon,
      title: config.getTitle(item),
      subtitle: config.subtitle(item),
      path: config.path,
    }));
}

export function DashboardPage() {
  const { jobs, projects, bids, workers, materials, contracts } = useConstructionStore();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const totalRevenue = bids.reduce((sum, b) => sum + b.estimatedCost, 0);
  const activeJobs = jobs.filter((j) => j.status === 'active').length;

  const handleClearSearch = useCallback(() => {
    setQuery('');
    searchRef.current?.focus();
  }, []);

  const handleResultClick = useCallback((path: string) => {
    setQuery('');
    navigate(path);
  }, [navigate]);

  const searchResults: SearchResult[] = React.useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    if (!q) return [];

    return [
      ...searchEntities(q, {
        items: jobs,
        category: 'Jobs',
        icon: '💼',
        path: '/construction/crm',
        fields: (j) => [j.title, j.location, j.jobType],
        subtitle: (j) => `${j.jobType} · ${j.location}`,
        getId: (j) => j.id,
        getTitle: (j) => j.title,
      }),
      ...searchEntities(q, {
        items: projects,
        category: 'Projects',
        icon: '🏗️',
        path: '/construction/projects',
        fields: (p) => [p.title, p.status],
        subtitle: (p) => `${p.status} · ${p.progress}% complete`,
        getId: (p) => p.id,
        getTitle: (p) => p.title,
      }),
      ...searchEntities(q, {
        items: workers,
        category: 'Workforce',
        icon: '👷',
        path: '/construction/workforce',
        fields: (w) => [w.name, w.role, w.email],
        subtitle: (w) => `${w.role} · ${w.hoursLogged}h logged`,
        getId: (w) => w.id,
        getTitle: (w) => w.name,
      }),
      ...searchEntities(q, {
        items: materials,
        category: 'Materials',
        icon: '📦',
        path: '/construction/materials',
        fields: (m) => [m.name, m.vendor, m.status],
        subtitle: (m) => `${m.vendor} · ${m.status}`,
        getId: (m) => m.id,
        getTitle: (m) => m.name,
      }),
      ...searchEntities(q, {
        items: contracts,
        category: 'Contracts',
        icon: '⚖️',
        path: '/construction/contracts',
        fields: (c) => [c.title, c.status],
        subtitle: (c) => `Status: ${c.status}`,
        getId: (c) => c.id,
        getTitle: (c) => c.title,
      }),
    ];
  }, [deferredQuery, jobs, projects, workers, materials, contracts]);

  const grouped = React.useMemo(() => {
    const map: Record<string, SearchResult[]> = {};
    searchResults.forEach((r) => {
      if (!map[r.category]) map[r.category] = [];
      map[r.category].push(r);
    });
    return map;
  }, [searchResults]);

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
      <Grid container spacing={2} sx={{ mb: 4 }}>
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

      {/* Global Search */}
      <Box sx={{ mb: 4 }}>
        <TextField
          inputRef={searchRef}
          autoFocus
          fullWidth
          placeholder="Search jobs, projects, workers, materials, contracts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography fontSize={20}>🔍</Typography>
              </InputAdornment>
            ),
            endAdornment: query ? (
              <InputAdornment position="end">
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={handleClearSearch}
                >
                  ✕ Clear
                </Typography>
              </InputAdornment>
            ) : undefined,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              fontSize: 16,
            },
          }}
        />

        {query.trim() && (
          <Paper
            elevation={0}
            variant="outlined"
            sx={{ mt: 1, borderRadius: 2, overflow: 'hidden' }}
          >
            {searchResults.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No results for &ldquo;{query}&rdquo;
                </Typography>
              </Box>
            ) : (
              Object.entries(grouped).map(([category, items], gi) => (
                <React.Fragment key={category}>
                  {gi > 0 && <Divider />}
                  <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                      {category}
                    </Typography>
                  </Box>
                  <List dense disablePadding>
                    {items.map((result, ri) => (
                      <React.Fragment key={result.id}>
                        {ri > 0 && <Divider component="li" />}
                        <ListItemButton
                          onClick={() => handleResultClick(result.path)}
                          sx={{ px: 2, py: 1 }}
                        >
                          <Box sx={{ mr: 1.5, fontSize: 18, lineHeight: 1 }}>{result.icon}</Box>
                          <ListItemText
                            primary={result.title}
                            secondary={result.subtitle}
                            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                            secondaryTypographyProps={{ variant: 'caption' }}
                          />
                          <Typography variant="caption" color="text.disabled">→</Typography>
                        </ListItemButton>
                      </React.Fragment>
                    ))}
                  </List>
                </React.Fragment>
              ))
            )}
          </Paper>
        )}
      </Box>

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
