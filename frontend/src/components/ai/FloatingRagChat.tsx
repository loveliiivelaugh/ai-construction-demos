import { useEffect, useState } from 'react';
import { Box, Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import RagChat from './RagChat';

export default function FloatingRagChat() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((previous) => !previous);
      }
    };

    const openAssistant = () => setOpen(true);
    const toggleAssistant = () => setOpen((previous) => !previous);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('open-rag-chat', openAssistant);
    window.addEventListener('toggle-rag-chat', toggleAssistant);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('open-rag-chat', openAssistant);
      window.removeEventListener('toggle-rag-chat', toggleAssistant);
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        right: { xs: 12, sm: 20 },
        bottom: { xs: 12, sm: 20 },
        zIndex: 1500,
      }}
    >
      {open ? (
        <Box sx={{ mb: 1.5, width: isMobile ? 'calc(100vw - 24px)' : 'min(720px, calc(100vw - 40px))' }}>
          <RagChat onClose={() => setOpen(false)} mobileFullscreen={false} />
        </Box>
      ) : null}

      <Button
        variant="contained"
        onClick={() => setOpen((previous) => !previous)}
        sx={{
          minWidth: 0,
          width: isMobile ? 64 : 68,
          height: isMobile ? 64 : 68,
          borderRadius: '999px',
          fontSize: 26,
          boxShadow: '0 18px 42px rgba(15, 23, 42, 0.3)',
          background: 'linear-gradient(135deg, #22C55E 0%, #0F766E 100%)',
        }}
        aria-label="Open construction AI assistant"
      >
        {open ? '×' : 'AI'}
      </Button>
    </Box>
  );
}
