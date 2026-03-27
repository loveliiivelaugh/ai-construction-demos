import { Box, Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function HomePage() {
  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="overline" color="text.secondary">
          Starter Template
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>
          Build your next product fast
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 640 }}>
          This is a domain-agnostic starter with a React/Vite frontend, Bun/Hono backend,
          OpenAPI wiring, and testing setup. Replace this page with your product UI.
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
