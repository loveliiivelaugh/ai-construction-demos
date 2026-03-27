import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useConstructionStore, type Job } from '../../../../utilities/store/constructionStore';

const JOB_TYPES = ['Renovation', 'New Build', 'Repair', 'Commercial'] as const;

const statusColors: Record<Job['status'], 'warning' | 'success' | 'default'> = {
  pending: 'warning',
  active: 'success',
  completed: 'default',
};

interface JobFormData {
  title: string;
  jobType: (typeof JOB_TYPES)[number];
  location: string;
  budget: string;
  description: string;
}

const emptyForm: JobFormData = {
  title: '',
  jobType: 'Renovation',
  location: '',
  budget: '',
  description: '',
};

export function CRMPage() {
  const { jobs, addJob } = useConstructionStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<JobFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field: keyof JobFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!form.title || !form.location || !form.budget) return;
    setSubmitting(true);
    await new Promise((res) => setTimeout(res, 600));
    addJob({
      title: form.title,
      jobType: form.jobType,
      location: form.location,
      budget: parseFloat(form.budget) || 0,
      description: form.description,
    });
    setSubmitting(false);
    setOpen(false);
    setForm(emptyForm);
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>
            CRM / Job Intake
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage incoming jobs and client projects
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setOpen(true)} startIcon={<span>➕</span>}>
          New Job
        </Button>
      </Box>

      {jobs.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography fontSize={48}>📋</Typography>
          <Typography variant="h6" color="text.secondary">
            No jobs yet
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Click "New Job" to add your first job
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {jobs.map((job) => (
            <Grid item xs={12} sm={6} lg={4} key={job.id}>
              <Card
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: 4 },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ flex: 1, mr: 1 }}>
                      {job.title}
                    </Typography>
                    <Chip
                      label={job.status}
                      size="small"
                      color={statusColors[job.status]}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>

                  <Chip label={job.jobType} size="small" variant="outlined" sx={{ mb: 1.5, fontSize: 11 }} />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography fontSize={14}>📍</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {job.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography fontSize={14}>💵</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        ${job.budget.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  {job.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                      {job.description}
                    </Typography>
                  )}

                  <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1.5 }}>
                    Added {job.createdAt}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* New Job Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>Add New Job</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Job Title"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            fullWidth
          />
          <TextField
            select
            label="Job Type"
            value={form.jobType}
            onChange={(e) => handleChange('jobType', e.target.value)}
            fullWidth
          >
            {JOB_TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Location"
            value={form.location}
            onChange={(e) => handleChange('location', e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Budget ($)"
            type="number"
            value={form.budget}
            onChange={(e) => handleChange('budget', e.target.value)}
            required
            fullWidth
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            multiline
            rows={3}
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
            disabled={submitting || !form.title || !form.location || !form.budget}
            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {submitting ? 'Adding…' : 'Add Job'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CRMPage;
