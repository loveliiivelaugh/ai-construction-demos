import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Divider,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);

const mockSections = ['Foundation', 'Framing', 'Electrical', 'Plumbing', 'HVAC', 'Roofing', 'Finishing'];

const mockDetectedMaterials = [
  { name: 'Concrete (3000 PSI)', quantity: '12 cubic yards' },
  { name: 'Lumber 2x6x12', quantity: '85 boards' },
  { name: '12/2 Romex Wire', quantity: '320 ft' },
  { name: 'PEX Tubing 1/2"', quantity: '180 ft' },
  { name: 'R-19 Insulation', quantity: '420 sq ft' },
  { name: 'OSB Sheathing 4x8', quantity: '30 sheets' },
];

const mockIssues = [
  { severity: 'error', text: 'Structural beam span exceeds 12ft without intermediate support' },
  { severity: 'warning', text: 'Electrical panel location conflicts with planned plumbing run' },
  { severity: 'warning', text: 'Window egress dimensions may not meet code for bedroom' },
];

export function BlueprintsPage() {
  const [uploading, setUploading] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleUpload() {
    setUploading(true);
    setAnalysisComplete(false);
    await new Promise((res) => setTimeout(res, 1500));
    setFileName('blueprint_floor_plan_v3.pdf');
    setUploading(false);
    setAnalysisComplete(true);
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>
          Blueprint Upload & Analysis
        </Typography>
        <Typography variant="body2" color="text.secondary">
          AI-powered blueprint parsing, material detection, and issue flagging
        </Typography>
      </Box>

      {/* Upload Zone */}
      <Paper
        elevation={0}
        sx={{
          border: '2px dashed',
          borderColor: analysisComplete ? 'success.main' : 'primary.main',
          borderRadius: 3,
          p: 6,
          textAlign: 'center',
          mb: 3,
          bgcolor: analysisComplete ? 'success.50' : 'action.hover',
          transition: 'all 0.3s',
        }}
      >
        {uploading ? (
          <Box>
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography variant="h6" fontWeight={600}>
              Analyzing blueprint…
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI is parsing sections, detecting materials, and flagging issues
            </Typography>
          </Box>
        ) : analysisComplete ? (
          <Box>
            <Typography fontSize={48}>✅</Typography>
            <Typography variant="h6" fontWeight={700} color="success.main">
              Analysis Complete
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {fileName}
            </Typography>
            <Chip label="AI Analysis Complete" color="success" icon={<span>🤖</span>} />
          </Box>
        ) : (
          <Box>
            <Typography fontSize={64} sx={{ mb: 1 }}>
              📐
            </Typography>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
              Upload Blueprint
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Supports PDF, DWG, PNG, JPG up to 50MB
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleUpload}
              startIcon={<span>⬆️</span>}
            >
              Upload Blueprint
            </Button>
          </Box>
        )}
      </Paper>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysisComplete && (
          <MotionBox
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4 }}
          >
            <Grid container spacing={2}>
              {/* Sections Detected */}
              <Grid item xs={12} md={4}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                      🗂️ Sections Detected ({mockSections.length})
                    </Typography>
                    <List dense disablePadding>
                      {mockSections.map((section) => (
                        <ListItem key={section} disableGutters dense>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip label="✓" size="small" color="success" sx={{ fontSize: 10, height: 18 }} />
                                <Typography variant="body2">{section}</Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Materials Detected */}
              <Grid item xs={12} md={4}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                      📦 Materials Detected ({mockDetectedMaterials.length})
                    </Typography>
                    <List dense disablePadding>
                      {mockDetectedMaterials.map((mat, i) => (
                        <React.Fragment key={mat.name}>
                          <ListItem disableGutters dense>
                            <ListItemText
                              primary={mat.name}
                              secondary={mat.quantity}
                              primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                              secondaryTypographyProps={{ variant: 'caption' }}
                            />
                          </ListItem>
                          {i < mockDetectedMaterials.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Flagged Issues */}
              <Grid item xs={12} md={4}>
                <Card
                  elevation={0}
                  sx={{
                    border: '1px solid',
                    borderColor: 'error.light',
                    height: '100%',
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                      🚩 Flagged Issues ({mockIssues.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {mockIssues.map((issue, i) => (
                        <Paper
                          key={i}
                          elevation={0}
                          sx={{
                            p: 1.5,
                            border: '1px solid',
                            borderColor: issue.severity === 'error' ? 'error.light' : 'warning.light',
                            borderRadius: 1.5,
                            bgcolor: issue.severity === 'error' ? 'error.50' : 'warning.50',
                          }}
                        >
                          <Chip
                            label={issue.severity}
                            size="small"
                            color={issue.severity === 'error' ? 'error' : 'warning'}
                            sx={{ mb: 0.5, textTransform: 'capitalize', fontSize: 10 }}
                          />
                          <Typography variant="body2">{issue.text}</Typography>
                        </Paper>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Re-upload button */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => { setAnalysisComplete(false); setFileName(null); }}
              >
                Upload Another Blueprint
              </Button>
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default BlueprintsPage;
