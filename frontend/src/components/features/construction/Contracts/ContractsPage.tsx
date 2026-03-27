import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Divider,
} from '@mui/material';
import { useConstructionStore, type Contract } from '../../../../utilities/store/constructionStore';

const statusColors: Record<Contract['status'], 'default' | 'info' | 'success'> = {
  draft: 'default',
  sent: 'info',
  signed: 'success',
};

const statusLabels: Record<Contract['status'], string> = {
  draft: '📄 Draft',
  sent: '📨 Sent',
  signed: '✅ Signed',
};

export function ContractsPage() {
  const { jobs, contracts, generateContract, updateContractStatus } = useConstructionStore();
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleGenerate() {
    if (!selectedJobId) return;
    setGenerating(true);
    await generateContract(selectedJobId);
    setGenerating(false);
    setSelectedJobId('');
  }

  async function handleStatusChange(contractId: string, newStatus: Contract['status']) {
    setUpdatingId(contractId);
    await new Promise((res) => setTimeout(res, 600));
    updateContractStatus(contractId, newStatus);
    setUpdatingId(null);
    if (viewingContract?.id === contractId) {
      setViewingContract((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Legal & Contracts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Generate, send, and manage construction contracts
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Select
            size="small"
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            displayEmpty
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="" disabled>
              Select a job…
            </MenuItem>
            {jobs.map((j) => (
              <MenuItem key={j.id} value={j.id}>
                {j.title}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            disabled={!selectedJobId || generating}
            onClick={handleGenerate}
            startIcon={generating ? <CircularProgress size={16} color="inherit" /> : <span>⚖️</span>}
          >
            {generating ? 'Generating…' : 'Generate Contract'}
          </Button>
        </Box>
      </Box>

      {/* Contracts Table */}
      {contracts.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 8, textAlign: 'center', borderStyle: 'dashed' }}>
          <Typography fontSize={48}>⚖️</Typography>
          <Typography variant="h6" color="text.secondary">
            No contracts yet
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Generate a contract from a job above
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Contract Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Job</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Workflow</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Preview</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts.map((contract) => {
                const job = jobs.find((j) => j.id === contract.jobId);
                const isUpdating = updatingId === contract.id;
                return (
                  <TableRow key={contract.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {contract.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {job?.title ?? contract.jobId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabels[contract.status]}
                        size="small"
                        color={statusColors[contract.status]}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {contract.status === 'draft' && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="info"
                            disabled={isUpdating}
                            onClick={() => handleStatusChange(contract.id, 'sent')}
                            startIcon={isUpdating ? <CircularProgress size={12} color="inherit" /> : null}
                          >
                            Send for Signature
                          </Button>
                        )}
                        {contract.status === 'sent' && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            disabled={isUpdating}
                            onClick={() => handleStatusChange(contract.id, 'signed')}
                            startIcon={isUpdating ? <CircularProgress size={12} color="inherit" /> : null}
                          >
                            Mark Signed
                          </Button>
                        )}
                        {contract.status === 'signed' && (
                          <Typography variant="caption" color="success.main" fontWeight={600}>
                            ✅ Fully executed
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => setViewingContract(contract)}
                        startIcon={<span>👁️</span>}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Contract Detail Modal */}
      <Dialog
        open={viewingContract !== null}
        onClose={() => setViewingContract(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography fontWeight={700} sx={{ flex: 1 }}>
            {viewingContract?.title}
          </Typography>
          {viewingContract && (
            <Chip
              label={statusLabels[viewingContract.status]}
              size="small"
              color={statusColors[viewingContract.status]}
            />
          )}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: 'background.default',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              fontFamily: 'monospace',
            }}
          >
            <Typography
              component="pre"
              sx={{
                fontFamily: 'inherit',
                fontSize: 13,
                lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                m: 0,
              }}
            >
              {viewingContract?.content}
            </Typography>
          </Paper>

          {/* Approval Actions inside modal */}
          {viewingContract && viewingContract.status !== 'signed' && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              {viewingContract.status === 'draft' && (
                <Button
                  variant="contained"
                  color="info"
                  disabled={updatingId === viewingContract.id}
                  onClick={() => handleStatusChange(viewingContract.id, 'sent')}
                  startIcon={<span>📨</span>}
                >
                  Send for Signature
                </Button>
              )}
              {viewingContract.status === 'sent' && (
                <Button
                  variant="contained"
                  color="success"
                  disabled={updatingId === viewingContract.id}
                  onClick={() => handleStatusChange(viewingContract.id, 'signed')}
                  startIcon={<span>✅</span>}
                >
                  Mark Signed
                </Button>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setViewingContract(null)}>Close</Button>
          <Button variant="outlined" startIcon={<span>🖨️</span>}>
            Print / Export
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ContractsPage;
