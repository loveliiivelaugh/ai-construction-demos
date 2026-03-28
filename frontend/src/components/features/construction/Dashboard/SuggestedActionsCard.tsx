import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
  Button,
  Divider,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { ActionRecommendation, UrgencyLevel } from '../../../../utilities/store/constructionStore';

// ---------------------------------------------------------------------------
// Urgency config
// ---------------------------------------------------------------------------
const urgencyConfig: Record<
  UrgencyLevel,
  { label: string; color: 'error' | 'warning' | 'info' | 'default'; bg: string }
> = {
  critical: { label: 'Critical', color: 'error', bg: 'error.50' },
  high:     { label: 'High',     color: 'error', bg: 'error.50' },
  medium:   { label: 'Medium',   color: 'warning', bg: 'warning.50' },
  low:      { label: 'Low',      color: 'default', bg: 'action.hover' },
};

// ---------------------------------------------------------------------------
// Confidence bar
// ---------------------------------------------------------------------------
function ConfidenceBar({ value }: { value: number }) {
  const color =
    value >= 90 ? '#22c55e' :
    value >= 75 ? '#f59e0b' :
    '#ef4444';

  return (
    <Tooltip title={`AI confidence: ${value}%`} placement="top" arrow>
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: 0.75, cursor: 'default' }}
        data-testid="confidence-bar"
      >
        <Box
          sx={{
            width: 48,
            height: 6,
            borderRadius: 3,
            bgcolor: 'divider',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: `${value}%`,
              height: '100%',
              bgcolor: color,
              borderRadius: 3,
              transition: 'width 0.6s ease',
            }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" lineHeight={1}>
          {value}%
        </Typography>
      </Box>
    </Tooltip>
  );
}

// ---------------------------------------------------------------------------
// Linked entity chip
// ---------------------------------------------------------------------------
function EntityChip({ entity, onClick }: {
  entity: ActionRecommendation['linkedEntities'][0];
  onClick: () => void;
}) {
  const typeIcon: Record<string, string> = {
    job: '💼',
    bid: '📋',
    contract: '⚖️',
    worker: '👷',
    material: '📦',
    project: '🏗️',
  };
  return (
    <Chip
      label={`${typeIcon[entity.type] ?? '🔗'} ${entity.label}`}
      size="small"
      onClick={onClick}
      sx={{
        fontSize: 11,
        height: 22,
        cursor: 'pointer',
        '& .MuiChip-label': { px: 1 },
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Single action row
// ---------------------------------------------------------------------------
interface ActionRowProps {
  action: ActionRecommendation;
  index: number;
  onAgentAction?: (action: ActionRecommendation, agentActionSlug: string) => void;
}

function ActionRow({ action, index, onAgentAction }: ActionRowProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const urgency = urgencyConfig[action.urgency];

  const handlePrimary = () => {
    if (action.primaryCta.path) navigate(action.primaryCta.path);
  };

  const handleSecondary = () => {
    if (action.secondaryCta?.agentAction && onAgentAction) {
      onAgentAction(action, action.secondaryCta.agentAction);
    } else if (action.secondaryCta?.path) {
      navigate(action.secondaryCta.path);
    }
  };

  const isAgentCta = Boolean(action.secondaryCta?.agentAction);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35, ease: 'easeOut' }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
          '&:hover': { bgcolor: 'action.hover' },
          transition: 'background 0.15s',
          borderRadius: 1,
        }}
      >
        {/* Main row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          {/* Rank badge */}
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              bgcolor: 'action.selected',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              mt: 0.25,
            }}
          >
            <Typography variant="caption" fontWeight={700} lineHeight={1}>
              {action.rank}
            </Typography>
          </Box>

          {/* Icon */}
          {action.icon && (
            <Typography fontSize={20} lineHeight={1} sx={{ mt: 0.1, flexShrink: 0 }}>
              {action.icon}
            </Typography>
          )}

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Title + tags */}
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.75, mb: 0.5 }}>
              <Typography variant="body2" fontWeight={700} sx={{ mr: 0.5 }}>
                {action.title}
              </Typography>
              <Chip
                label={urgency.label}
                size="small"
                color={urgency.color}
                variant="filled"
                sx={{ fontSize: 10, height: 20, fontWeight: 700, '& .MuiChip-label': { px: 0.75 } }}
                data-testid={`urgency-chip-${action.id}`}
              />
              <ConfidenceBar value={action.confidence} />
            </Box>

            {/* Reason (collapsible) */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: expanded ? 'unset' : 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.5,
              }}
            >
              {action.reason}
            </Typography>

            {/* Expand / collapse toggle */}
            <Box
              component="span"
              onClick={() => setExpanded((v) => !v)}
              sx={{
                display: 'inline-block',
                mt: 0.25,
                fontSize: 11,
                color: 'primary.main',
                cursor: 'pointer',
                userSelect: 'none',
                fontWeight: 600,
              }}
            >
              {expanded ? '▲ Less' : '▼ More'}
            </Box>

            {/* Linked entities */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  key="entities"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {action.linkedEntities.map((ent) => (
                      <EntityChip
                        key={ent.id}
                        entity={ent}
                        onClick={() => navigate(ent.path)}
                      />
                    ))}
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTAs */}
            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
              <Button
                size="small"
                variant={action.primaryCta.variant}
                onClick={handlePrimary}
                sx={{ fontSize: 12, py: 0.5, px: 1.5 }}
              >
                {action.primaryCta.label}
              </Button>
              {action.secondaryCta && (
                <Button
                  size="small"
                  variant={action.secondaryCta.variant}
                  onClick={handleSecondary}
                  startIcon={isAgentCta ? <span style={{ fontSize: 14 }}>🤖</span> : undefined}
                  sx={{ fontSize: 12, py: 0.5, px: 1.5 }}
                  data-testid={`secondary-cta-${action.id}`}
                >
                  {action.secondaryCta.label}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Public props
// ---------------------------------------------------------------------------
export interface SuggestedActionsCardProps {
  actions: ActionRecommendation[];
  /** Called when the user clicks a "Run with Agent" CTA */
  onAgentAction?: (action: ActionRecommendation, agentActionSlug: string) => void;
  /** Optional title override */
  title?: string;
  /** Loading state */
  loading?: boolean;
}

// ---------------------------------------------------------------------------
// Main card
// ---------------------------------------------------------------------------
export function SuggestedActionsCard({
  actions,
  onAgentAction,
  title = 'Suggested Next Actions',
  loading = false,
}: SuggestedActionsCardProps) {
  const sorted = [...actions].sort((a, b) => a.rank - b.rank);

  return (
    <Card
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', width: '100%' }}
      data-testid="suggested-actions-card"
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        {/* Card header */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography fontSize={20} lineHeight={1}>🧠</Typography>
            <Typography variant="subtitle1" fontWeight={700}>
              {title}
            </Typography>
            <Chip
              label={`${sorted.length} actions`}
              size="small"
              color="primary"
              sx={{ fontSize: 11, height: 20, '& .MuiChip-label': { px: 0.75 } }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            AI-ranked by urgency &amp; confidence
          </Typography>
        </Box>

        {/* Loading placeholder */}
        {loading && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Analyzing your portfolio…
            </Typography>
          </Box>
        )}

        {/* Empty state */}
        {!loading && sorted.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography fontSize={32} lineHeight={1} sx={{ mb: 1 }}>✅</Typography>
            <Typography variant="body2" color="text.secondary">
              All caught up — no recommended actions right now.
            </Typography>
          </Box>
        )}

        {/* Action rows */}
        {!loading &&
          sorted.map((action, i) => (
            <React.Fragment key={action.id}>
              {i > 0 && <Divider />}
              <ActionRow
                action={action}
                index={i}
                onAgentAction={onAgentAction}
              />
            </React.Fragment>
          ))}
      </CardContent>
    </Card>
  );
}

export default SuggestedActionsCard;

// Re-export types for consumers
export type { ActionRecommendation };
