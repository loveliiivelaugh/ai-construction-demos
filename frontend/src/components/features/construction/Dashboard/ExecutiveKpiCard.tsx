import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
};

/** A single data point in the sparkline trend array */
export type TrendPoint = number;

export type KpiStatus = 'loading' | 'empty' | 'error' | 'ok';

export interface ExecutiveKpiCardProps {
  /** Display label for the metric */
  label: string;
  /** Formatted display value (e.g. "$124k") */
  value?: string | number;
  /** Change vs prior period, e.g. +12.5 (percent) or "+$3k" */
  delta?: number | string;
  /** Whether a positive delta is good (default true). Set false for "at risk" / cost metrics. */
  deltaPositiveIsGood?: boolean;
  /** Array of numbers used to render the sparkline. Min 2 points. */
  trend?: TrendPoint[];
  /** Short explanatory sentence shown beneath the value */
  microcopy?: string;
  /** Emoji or short text icon shown in the top-right badge */
  icon?: string;
  /** MUI colour key used for accents (default "primary") */
  color?: string;
  /** Animation index – controls staggered entrance delay */
  index?: number;
  /** Called when the card is clicked */
  onClick?: () => void;
  /** Rendering state */
  status?: KpiStatus;
  /** Message shown in error state */
  errorMessage?: string;
}

// ---------------------------------------------------------------------------
// Sparkline (pure SVG, no extra dependency)
// ---------------------------------------------------------------------------
function Sparkline({ data, color }: { data: TrendPoint[]; color: string }) {
  if (!data || data.length < 2) return null;

  const w = 80;
  const h = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });

  const polyline = pts.join(' ');

  // Filled area under the line
  const firstPt = pts[0].split(',');
  const lastPt = pts[pts.length - 1].split(',');
  const areaPoints = `${firstPt[0]},${h} ${polyline} ${lastPt[0]},${h}`;

  return (
    <svg
      width={w}
      height={h}
      aria-label="trend sparkline"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`var(--mui-palette-${color}-main, currentColor)`} stopOpacity={0.3} />
          <stop offset="100%" stopColor={`var(--mui-palette-${color}-main, currentColor)`} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#grad-${color})`} />
      <polyline
        points={polyline}
        fill="none"
        stroke={`var(--mui-palette-${color}-main, currentColor)`}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Delta badge
// ---------------------------------------------------------------------------
function DeltaBadge({
  delta,
  positiveIsGood,
}: {
  delta: number | string;
  positiveIsGood: boolean;
}) {
  const numeric = typeof delta === 'number' ? delta : parseFloat(String(delta));
  const isPositive = !isNaN(numeric) ? numeric > 0 : String(delta).startsWith('+');
  const isNeutral = !isNaN(numeric) && numeric === 0;

  const good = isNeutral ? null : isPositive === positiveIsGood;

  const color = isNeutral
    ? 'text.secondary'
    : good
    ? 'success.main'
    : 'error.main';

  const arrow = isNeutral ? '→' : isPositive ? '↑' : '↓';

  const label =
    typeof delta === 'number'
      ? `${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`
      : String(delta);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
      <Typography variant="caption" fontWeight={700} color={color} sx={{ lineHeight: 1 }}>
        {arrow}
      </Typography>
      <Typography variant="caption" fontWeight={600} color={color}>
        {label}
      </Typography>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function ExecutiveKpiCard({
  label,
  value,
  delta,
  deltaPositiveIsGood = true,
  trend,
  microcopy,
  icon,
  color = 'primary',
  index = 0,
  onClick,
  status = 'ok',
  errorMessage,
}: ExecutiveKpiCardProps) {
  const isClickable = Boolean(onClick);

  const cardContent = (
    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
      {/* Header row: label + icon */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={500} lineHeight={1.3}>
          {label}
        </Typography>
        {icon && (
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              bgcolor: `${color}.50`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0,
              ml: 1,
            }}
          >
            {icon}
          </Box>
        )}
      </Box>

      {/* Loading state */}
      {status === 'loading' && (
        <>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="40%" height={20} sx={{ mt: 0.5 }} />
        </>
      )}

      {/* Error state */}
      {status === 'error' && (
        <Typography variant="body2" color="error.main" fontWeight={500}>
          {errorMessage ?? 'Unable to load data'}
        </Typography>
      )}

      {/* Empty state */}
      {status === 'empty' && (
        <Typography variant="body2" color="text.disabled">
          No data available
        </Typography>
      )}

      {/* OK state */}
      {status === 'ok' && (
        <>
          {/* Value */}
          <Typography variant="h4" fontWeight={800} color={`${color}.main`} lineHeight={1.1}>
            {value ?? '—'}
          </Typography>

          {/* Delta + sparkline row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.75 }}>
            {delta !== undefined ? (
              <DeltaBadge delta={delta} positiveIsGood={deltaPositiveIsGood} />
            ) : (
              <Box />
            )}
            {trend && trend.length >= 2 && (
              <Box sx={{ color: `${color}.main` }}>
                <Sparkline data={trend} color={color} />
              </Box>
            )}
          </Box>

          {/* Microcopy */}
          {microcopy && (
            <Tooltip title={microcopy} placement="bottom-start" arrow>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mt: 0.75,
                  cursor: 'default',
                }}
              >
                {microcopy}
              </Typography>
            </Tooltip>
          )}
        </>
      )}
    </CardContent>
  );

  return (
    <MotionCard
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}
    >
      {isClickable ? (
        <CardActionArea onClick={onClick} sx={{ height: '100%', alignItems: 'flex-start' }}>
          {cardContent}
        </CardActionArea>
      ) : (
        cardContent
      )}
    </MotionCard>
  );
}

export default ExecutiveKpiCard;
