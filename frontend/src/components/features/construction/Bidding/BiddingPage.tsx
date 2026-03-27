import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useConstructionStore } from '../../../../utilities/store/constructionStore';

const MotionBox = motion(Box);

const bidStatusColors: Record<string, 'default' | 'warning' | 'info' | 'success'> = {
  pending: 'default',
  generated: 'info',
  sent: 'success',
};

export function BiddingPage() {
  const { jobs, bids, generateBid } = useConstructionStore();
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);

  const jobsWithoutBids = jobs.filter((j) => !bids.some((b) => b.jobId === j.id));

  async function handleGenerateBid(jobId: string) {
    setLoadingJobId(jobId);
    await generateBid(jobId);
    setLoadingJobId(null);
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>
          Bidding Engine
        </Typography>
        <Typography variant="body2" color="text.secondary">
          AI-powered automated bid generation for your jobs
        </Typography>
      </Box>

      {/* Jobs awaiting bids */}
      {jobsWithoutBids.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            🔔 Jobs Awaiting Bids ({jobsWithoutBids.length})
          </Typography>
          <Grid container spacing={2}>
            {jobsWithoutBids.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <Card
                  elevation={0}
                  sx={{ border: '1px solid', borderColor: 'warning.main', borderStyle: 'dashed', height: '100%' }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
                      {job.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      📍 {job.location}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 2 }}>
                      Budget: ${job.budget.toLocaleString()}
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      size="small"
                      disabled={loadingJobId === job.id}
                      onClick={() => handleGenerateBid(job.id)}
                      startIcon={
                        loadingJobId === job.id ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          <span>🤖</span>
                        )
                      }
                    >
                      {loadingJobId === job.id ? 'Generating…' : 'Generate Bid'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Generated bids */}
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
        📋 All Bids ({bids.length})
      </Typography>

      {bids.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{ p: 6, textAlign: 'center', borderStyle: 'dashed' }}
        >
          <Typography fontSize={40}>📋</Typography>
          <Typography variant="h6" color="text.secondary">
            No bids generated yet
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          <AnimatePresence>
            {bids.map((bid) => {
              const job = jobs.find((j) => j.id === bid.jobId);
              return (
                <Grid item xs={12} sm={6} lg={4} key={bid.id}>
                  <MotionBox
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      elevation={0}
                      sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                          <Typography variant="subtitle2" fontWeight={700} sx={{ flex: 1, mr: 1 }}>
                            {job?.title ?? bid.jobId}
                          </Typography>
                          <Chip
                            label={bid.status}
                            size="small"
                            color={bidStatusColors[bid.status] ?? 'default'}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </Box>

                        <Typography variant="h5" fontWeight={800} color="success.main" sx={{ mb: 1 }}>
                          ${bid.estimatedCost.toLocaleString()}
                        </Typography>

                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">
                              Timeline
                            </Typography>
                            <Typography variant="caption" fontWeight={600}>
                              ⏱️ {bid.timeline}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">
                              Materials
                            </Typography>
                            <Typography variant="caption" fontWeight={600}>
                              {bid.materials.length} line items
                            </Typography>
                          </Box>
                        </Box>

                        {bid.materials.length > 0 && (
                          <Box sx={{ mt: 1.5 }}>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                              Materials included:
                            </Typography>
                            <List dense disablePadding>
                              {bid.materials.slice(0, 3).map((mid) => (
                                <ListItem key={mid} dense disableGutters sx={{ py: 0 }}>
                                  <ListItemText
                                    primary={`• ${mid}`}
                                    primaryTypographyProps={{ variant: 'caption' }}
                                  />
                                </ListItem>
                              ))}
                              {bid.materials.length > 3 && (
                                <Typography variant="caption" color="text.secondary">
                                  +{bid.materials.length - 3} more
                                </Typography>
                              )}
                            </List>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </MotionBox>
                </Grid>
              );
            })}
          </AnimatePresence>
        </Grid>
      )}
    </Box>
  );
}

export default BiddingPage;
