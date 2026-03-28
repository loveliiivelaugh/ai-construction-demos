import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ragChat } from '@api/rag';
import { queries } from '@api/index';
import { useRagChatStore } from '@store/ragChatStore';
import { useTypewriter } from '@lib/useTypewriter';

type Props = {
  onClose?: () => void;
  mobileFullscreen?: boolean;
  maxWidth?: number;
};

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const QUICK_PROMPTS = [
  {
    label: 'Bid Help',
    value: 'How can this platform help a construction team bid jobs faster and more accurately?',
  },
  {
    label: 'Project Ops',
    value: 'What project operations workflows can this construction demo support?',
  },
  {
    label: 'Document QA',
    value: 'How would I use this assistant to answer questions from blueprints, contracts, and project docs?',
  },
];

export default function RagChat({
  onClose,
  mobileFullscreen = true,
  maxWidth = 720,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const ragChatStore = useRagChatStore();
  const { text, start, stop } = useTypewriter({
    cps: 38,
    burst: [0, 1],
    punctPauseMs: 110,
  });

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Ask about estimating, project workflows, contracts, materials, and field operations. I answer from the Pinecone-backed construction knowledge base.',
    },
  ]);

  const { data: pingData, isLoading: pingLoading } = useQuery(queries.query('/api/v1/rag/ping'));
  const isReady = (pingData?.configured?.openaiApiKey && pingData?.configured?.pineconeApiKey) ?? false;

  const scrollRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const footerHeight = useMemo(
    () => footerRef.current?.offsetHeight ?? (isMobile ? 104 : 92),
    [isMobile],
  );

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollTop = element.scrollHeight;
  }, [messages, typing, text, ragChatStore.sources]);

  function pushUserMessage(content: string) {
    setMessages((previous) => [
      ...previous,
      { id: `user-${Date.now()}`, role: 'user', content },
    ]);
  }

  function pushAssistantThinking() {
    setMessages((previous) => [
      ...previous,
      { id: `assistant-${Date.now()}`, role: 'assistant', content: 'Thinking...' },
    ]);
  }

  function replaceLastAssistantMessage(content: string) {
    setMessages((previous) => {
      const next = [...previous];
      for (let index = next.length - 1; index >= 0; index -= 1) {
        if (next[index].role === 'assistant') {
          next[index] = { ...next[index], content };
          break;
        }
      }
      return next;
    });
  }

  async function ask(promptOverride?: string) {
    const prompt = (promptOverride ?? query).trim();
    if (!prompt || loading) return;

    setLoading(true);
    setTyping(false);
    stop();
    ragChatStore.setSources([]);
    ragChatStore.setAnswer('');
    pushUserMessage(prompt);
    setQuery('');
    pushAssistantThinking();

    try {
      const response = await ragChat(prompt, 5);
      const finalAnswer = response.answer || '';

      setTyping(true);
      start(finalAnswer, () => {
        ragChatStore.setAnswer(finalAnswer);
        replaceLastAssistantMessage(finalAnswer);
        setTyping(false);
      });

      ragChatStore.setSources(response.sources || []);
    } catch (error) {
      console.error('RAG chat request failed', error);
      replaceLastAssistantMessage(
        'I could not reach the construction knowledge base just now. Check the backend env vars and try again.',
      );
      setTyping(false);
    } finally {
      setLoading(false);
    }
  }

  const displayMessage = (message: Message, index: number) => {
    const isLastAssistant =
      message.role === 'assistant' && index === messages.length - 1 && typing;

    if (isLastAssistant) {
      return text || message.content;
    }

    return message.content;
  };

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      sx={{
        width: isMobile && mobileFullscreen ? '100vw' : '100%',
        maxWidth: isMobile ? '100vw' : maxWidth,
        height:
          isMobile && mobileFullscreen
            ? 'calc(94vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))'
            : 'min(72vh, 760px)',
        borderRadius: isMobile && mobileFullscreen ? 0 : 3,
        background:
          'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(17,24,39,0.96) 100%)',
        color: '#F8FAFC',
        border: '1px solid rgba(148,163,184,0.2)',
        boxShadow: '0 28px 72px rgba(15, 23, 42, 0.42)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: '1px solid rgba(148,163,184,0.16)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Construction AI Assistant
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(226,232,240,0.72)' }}>
            {pingLoading
              ? 'Checking Pinecone and OpenAI connection...'
              : isReady
                ? 'Knowledge base connected'
                : 'Backend reachable, but API keys or Pinecone host are not fully configured'}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography
            variant="caption"
            sx={{ color: 'rgba(226,232,240,0.6)', display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Cmd/Ctrl+Shift+K
          </Typography>
          {onClose ? (
            <Button size="small" variant="text" onClick={onClose} sx={{ color: '#E2E8F0' }}>
              Close
            </Button>
          ) : null}
        </Stack>
      </Box>

      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2,
          py: 2,
          pb: `calc(${footerHeight}px + 12px)`,
        }}
      >
        <Stack spacing={1.5}>
          {messages.map((message, index) => {
            const isAssistant = message.role === 'assistant';

            return (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: isAssistant ? 'flex-start' : 'flex-end',
                }}
              >
                <Box
                  sx={{
                    maxWidth: '88%',
                    px: 1.5,
                    py: 1.25,
                    borderRadius: 2,
                    bgcolor: isAssistant ? 'rgba(30,41,59,0.95)' : 'rgba(8,145,178,0.18)',
                    border: `1px solid ${
                      isAssistant ? 'rgba(148,163,184,0.18)' : 'rgba(34,211,238,0.28)'
                    }`,
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.65 }}>
                    {displayMessage(message, index)}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>

        <AnimatePresence>
          {ragChatStore.sources.length ? (
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'rgba(15,23,42,0.66)',
                border: '1px solid rgba(148,163,184,0.18)',
              }}
            >
              <Typography variant="overline" sx={{ color: 'rgba(148,163,184,0.92)' }}>
                Sources
              </Typography>
              <Stack spacing={1.25} sx={{ mt: 0.5 }}>
                {ragChatStore.sources.map((source, index) => (
                  <Box key={`${source.url}-${index}`}>
                    <MuiLink
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      underline="hover"
                      sx={{ color: '#67E8F9', fontWeight: 700 }}
                    >
                      {source.title || source.url || `Source ${index + 1}`}
                    </MuiLink>
                    {!!source.excerpt && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 0.5, color: 'rgba(226,232,240,0.82)' }}
                      >
                        {source.excerpt}
                      </Typography>
                    )}
                    {index < ragChatStore.sources.length - 1 ? (
                      <Divider sx={{ mt: 1.25, borderColor: 'rgba(148,163,184,0.14)' }} />
                    ) : null}
                  </Box>
                ))}
              </Stack>
            </Box>
          ) : null}
        </AnimatePresence>
      </Box>

      <Box
        ref={footerRef}
        sx={{
          p: 2,
          borderTop: '1px solid rgba(148,163,184,0.16)',
          background: 'rgba(15,23,42,0.92)',
        }}
      >
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.25 }}>
          {QUICK_PROMPTS.map((prompt) => (
            <Chip
              key={prompt.label}
              label={prompt.label}
              onClick={() => ask(prompt.value)}
              sx={{
                color: '#E2E8F0',
                bgcolor: 'rgba(51,65,85,0.95)',
                border: '1px solid rgba(100,116,139,0.35)',
              }}
            />
          ))}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <TextField
            fullWidth
            minRows={1}
            maxRows={4}
            multiline
            placeholder="Ask about bids, RFIs, schedules, blueprints, contracts, or workflows..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                void ask();
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                alignItems: 'flex-end',
                color: '#F8FAFC',
                backgroundColor: 'rgba(30,41,59,0.9)',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(148,163,184,0.24)',
              },
            }}
          />
          <Button
            variant="contained"
            onClick={() => void ask()}
            disabled={loading || !query.trim()}
            sx={{
              minWidth: 112,
              height: 56,
              background: 'linear-gradient(135deg, #22C55E 0%, #0F766E 100%)',
            }}
          >
            {loading ? 'Asking...' : 'Send'}
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}
