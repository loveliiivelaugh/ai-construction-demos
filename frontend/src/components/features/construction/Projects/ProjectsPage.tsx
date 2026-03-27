import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  Avatar,
  Badge,
} from '@mui/material';
import { useConstructionStore, type Project, type Task } from '../../../../utilities/store/constructionStore';

const PHASE_NAMES = ['Planning', 'Materials', 'Build', 'Inspection'] as const;

const statusColors: Record<Task['status'], 'default' | 'warning' | 'success'> = {
  todo: 'default',
  'in-progress': 'warning',
  done: 'success',
};

const phaseColors: Record<string, string> = {
  Planning: '#7b61ff',
  Materials: '#ff9800',
  Build: '#2196f3',
  Inspection: '#4caf50',
};

function KanbanColumn({
  name,
  tasks,
}: {
  name: string;
  tasks: Task[];
}) {
  const color = phaseColors[name] ?? '#888';
  return (
    <Box sx={{ flex: 1, minWidth: 220 }}>
      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            bgcolor: `${color}18`,
            borderBottom: `3px solid ${color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="subtitle2" fontWeight={700} sx={{ color }}>
            {name}
          </Typography>
          <Badge badgeContent={tasks.length} color="primary" />
        </Box>
        <Box sx={{ p: 1, minHeight: 200, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {tasks.map((task) => (
            <Paper
              key={task.id}
              elevation={0}
              sx={{
                p: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1.5,
                cursor: 'default',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                {task.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Avatar sx={{ width: 20, height: 20, fontSize: 10 }}>
                    {task.assignee.charAt(0)}
                  </Avatar>
                  <Typography variant="caption" color="text.secondary">
                    {task.assignee.split(' ')[0]}
                  </Typography>
                </Box>
                <Chip
                  label={task.status}
                  size="small"
                  color={statusColors[task.status]}
                  sx={{ fontSize: 10, height: 20, textTransform: 'capitalize' }}
                />
              </Box>
            </Paper>
          ))}
          {tasks.length === 0 && (
            <Typography variant="caption" color="text.disabled" sx={{ p: 1 }}>
              No tasks
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

function KanbanView({ project }: { project: Project }) {
  const columns = PHASE_NAMES.map((name) => {
    const phase = project.phases.find((p) => p.name === name);
    return { name, tasks: phase?.tasks ?? [] };
  });

  return (
    <Box sx={{ display: 'flex', gap: 2, overflow: 'auto', pb: 2 }}>
      {columns.map((col) => (
        <KanbanColumn key={col.name} name={col.name} tasks={col.tasks} />
      ))}
    </Box>
  );
}

function ListView({ project }: { project: Project }) {
  const allTasks = project.phases.flatMap((ph) =>
    ph.tasks.map((t) => ({ ...t, phaseName: ph.name }))
  );

  return (
    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Task</TableCell>
            <TableCell>Phase</TableCell>
            <TableCell>Assignee</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allTasks.map((task) => (
            <TableRow key={task.id} hover>
              <TableCell>{task.title}</TableCell>
              <TableCell>
                <Chip
                  label={task.phaseName}
                  size="small"
                  sx={{
                    bgcolor: `${phaseColors[task.phaseName] ?? '#888'}22`,
                    color: phaseColors[task.phaseName] ?? '#888',
                    fontWeight: 600,
                    fontSize: 11,
                  }}
                />
              </TableCell>
              <TableCell>{task.assignee}</TableCell>
              <TableCell>
                <Chip
                  label={task.status}
                  size="small"
                  color={statusColors[task.status]}
                  sx={{ textTransform: 'capitalize', fontSize: 11 }}
                />
              </TableCell>
            </TableRow>
          ))}
          {allTasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                  No tasks in this project.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}

export function ProjectsPage() {
  const { jobs, projects, kickoffProject } = useConstructionStore();
  const [tabValue, setTabValue] = useState(0);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id ?? '');
  const [kickoffJobId, setKickoffJobId] = useState<string | null>(null);
  const [kicking, setKicking] = useState(false);

  const jobsWithoutProjects = jobs.filter((j) => !projects.some((p) => p.jobId === j.id));
  const selectedProject = projects.find((p) => p.id === selectedProjectId) ?? projects[0];

  async function handleKickoff() {
    if (!kickoffJobId) return;
    setKicking(true);
    await kickoffProject(kickoffJobId);
    setKicking(false);
    setKickoffJobId(null);
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Project Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track phases, tasks, and team assignments
          </Typography>
        </Box>
        {jobsWithoutProjects.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Select
              size="small"
              value={kickoffJobId ?? ''}
              onChange={(e) => setKickoffJobId(e.target.value)}
              displayEmpty
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="" disabled>
                Select job to kick off
              </MenuItem>
              {jobsWithoutProjects.map((j) => (
                <MenuItem key={j.id} value={j.id}>
                  {j.title}
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              disabled={!kickoffJobId || kicking}
              onClick={handleKickoff}
              startIcon={kicking ? <CircularProgress size={16} color="inherit" /> : <span>🚀</span>}
            >
              {kicking ? 'Kicking off…' : 'Kickoff Project'}
            </Button>
          </Box>
        )}
      </Box>

      {projects.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 8, textAlign: 'center', borderStyle: 'dashed' }}>
          <Typography fontSize={48}>🗂️</Typography>
          <Typography variant="h6" color="text.secondary">
            No projects yet
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Kick off a project from a job above
          </Typography>
        </Paper>
      ) : (
        <>
          {/* Project selector */}
          {projects.length > 1 && (
            <Box sx={{ mb: 2 }}>
              <Select
                size="small"
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                sx={{ minWidth: 280 }}
              >
                {projects.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.title}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}

          <Tabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            sx={{ mb: 2, borderBottom: '1px solid', borderColor: 'divider' }}
          >
            <Tab label="🗂️ Kanban View" />
            <Tab label="📋 List View" />
          </Tabs>

          {selectedProject && tabValue === 0 && <KanbanView project={selectedProject} />}
          {selectedProject && tabValue === 1 && <ListView project={selectedProject} />}
        </>
      )}
    </Box>
  );
}

export default ProjectsPage;
