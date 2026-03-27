import { Divider, Stack, Typography } from '@mui/material';

export default function DocsPage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Starter Docs
      </Typography>
      <Typography color="text.secondary">
        Update this page with product-specific documentation, links, and onboarding steps.
      </Typography>
      <Divider />
      <Stack spacing={1}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Recommended docs
        </Typography>
        <Typography color="text.secondary">
          - Agents guide: `Agents.md`
        </Typography>
        <Typography color="text.secondary">
          - Frontend map: `frontend/APP_MAP.md`
        </Typography>
        <Typography color="text.secondary">
          - Backend map: `backend/APP_MAP.md`
        </Typography>
        <Typography color="text.secondary">
          - API contracts: `docs/CONTRACTS.md`
        </Typography>
      </Stack>
    </Stack>
  );
}
