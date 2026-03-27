import { Stack, Typography } from '@mui/material';
import ExampleCard from './components/ExampleCard';

export default function ExampleFeaturePage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Example Feature
      </Typography>
      <Typography color="text.secondary">
        Use this folder as a template for new product features.
      </Typography>
      <ExampleCard />
    </Stack>
  );
}
