import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useConstructionStore } from '../../../../utilities/store/constructionStore';

const PERIODS = ['This Week', 'Last Week', 'This Month'];

const roleColors: Record<string, string> = {
  Foreman: '#1976d2',
  Electrician: '#ed6c02',
  Carpenter: '#2e7d32',
  Plumber: '#0288d1',
};

export function PayrollPage() {
  const { payroll, workers, generatePayroll } = useConstructionStore();
  const [period, setPeriod] = useState('This Week');
  const [running, setRunning] = useState(false);
  const [editedHours, setEditedHours] = useState<Record<string, string>>({});

  const totalPayroll = payroll.reduce((sum, p) => sum + p.totalPay, 0);
  const totalHours = payroll.reduce((sum, p) => sum + p.hoursLogged, 0);
  const avgRate = payroll.length > 0 ? payroll.reduce((sum, p) => sum + p.hourlyRate, 0) / payroll.length : 0;

  async function handleRunPayroll() {
    setRunning(true);
    await generatePayroll(period);
    setRunning(false);
  }

  const workerRoles = workers.reduce<Record<string, string>>((acc, w) => {
    acc[w.id] = w.role;
    return acc;
  }, {});

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Payroll & Accounting
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage worker compensation and time tracking
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Select
            size="small"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            sx={{ minWidth: 140 }}
          >
            {PERIODS.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            disabled={running}
            onClick={handleRunPayroll}
            startIcon={running ? <CircularProgress size={16} color="inherit" /> : <span>▶️</span>}
          >
            {running ? 'Running…' : 'Run Payroll'}
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Payroll', value: `$${totalPayroll.toLocaleString()}`, icon: '💵', color: 'success' },
          { label: 'Hours Logged', value: `${totalHours}h`, icon: '⏱️', color: 'primary' },
          { label: 'Avg Hourly Rate', value: `$${avgRate.toFixed(0)}/hr`, icon: '📈', color: 'warning' },
          { label: 'Workers Paid', value: payroll.length, icon: '👷', color: 'info' },
        ].map((card) => (
          <Grid item xs={6} sm={3} key={card.label}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography fontSize={24}>{card.icon}</Typography>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {card.label}
                    </Typography>
                    <Typography variant="h6" fontWeight={800} color={`${card.color}.main`}>
                      {card.value}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Payroll Table */}
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
        Payroll Details — {period}
      </Typography>
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Worker</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Hours</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Rate</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Gross Pay</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payroll.map((row) => {
              const role = workerRoles[row.workerId] ?? 'Laborer';
              const roleColor = roleColors[role] ?? '#666';
              return (
                <TableRow key={row.workerId} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {row.workerName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={role}
                      size="small"
                      sx={{
                        bgcolor: `${roleColor}22`,
                        color: roleColor,
                        fontWeight: 600,
                        fontSize: 11,
                        border: `1px solid ${roleColor}44`,
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.hoursLogged}h</TableCell>
                  <TableCell>${row.hourlyRate}/hr</TableCell>
                  <TableCell>
                    <Typography fontWeight={700} color="success.main">
                      ${row.totalPay.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label="Pending" size="small" color="warning" />
                  </TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" startIcon={<span>🧾</span>}>
                      Invoice
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {payroll.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">
                    No payroll data. Click "Run Payroll" to generate.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Time Tracking */}
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
        ⏱️ Time Tracking
      </Typography>
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Worker</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Hours Logged</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Edit Hours</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workers.map((w) => (
              <TableRow key={w.id} hover>
                <TableCell>{w.name}</TableCell>
                <TableCell>
                  <Chip
                    label={w.role}
                    size="small"
                    sx={{
                      bgcolor: `${roleColors[w.role] ?? '#666'}22`,
                      color: roleColors[w.role] ?? '#666',
                      fontSize: 11,
                    }}
                  />
                </TableCell>
                <TableCell>{w.hoursLogged}h</TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={editedHours[w.id] ?? w.hoursLogged.toString()}
                    onChange={(e) =>
                      setEditedHours((prev) => ({ ...prev, [w.id]: e.target.value }))
                    }
                    inputProps={{ min: 0, max: 80, style: { width: 70 } }}
                    sx={{ width: 90 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default PayrollPage;
