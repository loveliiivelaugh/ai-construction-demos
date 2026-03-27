import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useConstructionStore } from '../../../../utilities/store/constructionStore';

const roleColors: Record<string, 'primary' | 'warning' | 'success' | 'info'> = {
  Foreman: 'primary',
  Electrician: 'warning',
  Carpenter: 'success',
  Plumber: 'info',
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const scheduleData: Record<string, Record<string, string>> = {
  'worker-1': { Mon: 'Kitchen Job', Tue: 'Kitchen Job', Wed: 'Kitchen Job', Thu: 'Deck Build', Fri: 'Office' },
  'worker-2': { Mon: 'Kitchen Elec', Tue: 'Kitchen Elec', Wed: '—', Thu: 'Bathroom Job', Fri: 'Bathroom Job' },
  'worker-3': { Mon: 'Deck Build', Tue: 'Deck Build', Wed: 'Deck Build', Thu: 'Deck Build', Fri: 'Kitchen Job' },
  'worker-4': { Mon: '—', Tue: 'Bathroom Job', Wed: 'Bathroom Job', Thu: 'Bathroom Job', Fri: '—' },
};

interface WorkerFormData {
  name: string;
  role: string;
  email: string;
  phone: string;
}

const emptyForm: WorkerFormData = { name: '', role: 'Carpenter', email: '', phone: '' };

export function WorkforcePage() {
  const { workers, addWorker } = useConstructionStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<WorkerFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field: keyof WorkerFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!form.name || !form.role) return;
    setSubmitting(true);
    await new Promise((res) => setTimeout(res, 500));
    addWorker(form);
    setSubmitting(false);
    setOpen(false);
    setForm(emptyForm);
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Workforce & Crew Scheduling
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage crew members and weekly assignments
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setOpen(true)} startIcon={<span>➕</span>}>
          Add Worker
        </Button>
      </Box>

      {/* Worker Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {workers.map((worker) => {
          const roleColor = roleColors[worker.role] ?? 'primary';
          return (
            <Grid item xs={12} sm={6} md={3} key={worker.id}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: 3 },
                }}
              >
                <CardContent sx={{ textAlign: 'center', pb: 2 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      mx: 'auto',
                      mb: 1.5,
                      bgcolor: `${roleColor}.main`,
                      fontSize: 22,
                      fontWeight: 800,
                    }}
                  >
                    {worker.name.charAt(0)}
                  </Avatar>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {worker.name}
                  </Typography>
                  <Chip
                    label={worker.role}
                    size="small"
                    color={roleColor}
                    sx={{ my: 0.5, fontSize: 11 }}
                  />
                  <Box sx={{ mt: 1, textAlign: 'left' }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      📧 {worker.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      📞 {worker.phone}
                    </Typography>
                    <Typography variant="caption" fontWeight={600} display="block" sx={{ mt: 0.5 }}>
                      ⏱️ {worker.hoursLogged}h logged
                    </Typography>
                  </Box>
                  <Button size="small" variant="outlined" fullWidth sx={{ mt: 1.5 }}>
                    Assign Task
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Weekly Schedule */}
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
        📅 Weekly Schedule (Current Week)
      </Typography>
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, minWidth: 140 }}>Worker</TableCell>
              {DAYS.map((day) => (
                <TableCell key={day} align="center" sx={{ fontWeight: 700 }}>
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {workers.map((worker) => (
              <TableRow key={worker.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: `${roleColors[worker.role] ?? 'primary'}.main` }}>
                      {worker.name.charAt(0)}
                    </Avatar>
                    <Typography variant="body2">{worker.name}</Typography>
                  </Box>
                </TableCell>
                {DAYS.map((day) => {
                  const assignment = scheduleData[worker.id]?.[day] ?? '—';
                  return (
                    <TableCell key={day} align="center">
                      <Typography
                        variant="caption"
                        color={assignment === '—' ? 'text.disabled' : 'text.primary'}
                      >
                        {assignment}
                      </Typography>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Add Worker Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>Add New Worker</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Full Name"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            fullWidth
          />
          <TextField
            select
            label="Role"
            value={form.role}
            onChange={(e) => handleChange('role', e.target.value)}
            fullWidth
            SelectProps={{ native: true }}
          >
            {['Foreman', 'Electrician', 'Carpenter', 'Plumber', 'Laborer'].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </TextField>
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            fullWidth
          />
          <TextField
            label="Phone"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting || !form.name || !form.role}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {submitting ? 'Adding…' : 'Add Worker'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default WorkforcePage;
