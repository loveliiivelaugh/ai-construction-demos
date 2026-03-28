import { Box, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function HomePage() {
  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="overline" color="text.secondary">
          RAG Construction Demo
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>
          Explore a construction portal with an AI knowledge assistant
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 640 }}>
          This demo now includes a Pinecone-backed chatbot that can answer questions about
          bids, projects, blueprints, contracts, materials, and construction operations
          anywhere in the site.
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button variant="contained" onClick={() => window.dispatchEvent(new Event('open-rag-chat'))}>
          Ask AI assistant
        </Button>
        <Button variant="contained" component={RouterLink} to="/docs">
          View docs
        </Button>
        <Button variant="outlined" component={RouterLink} to="/example">
          Example feature
        </Button>
      </Stack>
    </Stack>
  );
}
