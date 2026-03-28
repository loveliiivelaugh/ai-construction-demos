import { Box, Card, CardContent, Chip, Tooltip, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import type { CopperPriceData } from '../../../../utilities/store/constructionStore';

// ---------------------------------------------------------------------------
// Full-width SVG area chart
// ---------------------------------------------------------------------------
interface ChartProps {
  points: CopperPriceData['points'];
  width?: number;
  height?: number;
}

function CopperAreaChart({ points, width = 600, height = 80 }: ChartProps) {
  if (!points || points.length < 2) return null;

  const prices = points.map((p) => p.pricePerLb);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const range = maxP - minP || 0.01;
  const padV = 6;

  const toX = (i: number) => (i / (points.length - 1)) * width;
  const toY = (v: number) => height - padV - ((v - minP) / range) * (height - padV * 2);

  const ptStr = points.map((p, i) => `${toX(i)},${toY(p.pricePerLb)}`).join(' ');
  const firstX = toX(0);
  const lastX = toX(points.length - 1);
  const areaStr = `${firstX},${height} ${ptStr} ${lastX},${height}`;

  // Annotate last point
  const lastX2 = toX(points.length - 1);
  const lastY = toY(prices[prices.length - 1]);

  // Tick labels: show first, middle, last date
  const tickIndices = [0, Math.floor(points.length / 2), points.length - 1];
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      <svg
        viewBox={`0 0 ${width} ${height + 20}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: height + 20, display: 'block' }}
        aria-label="Copper price trend chart"
        data-testid="copper-area-chart"
      >
        <defs>
          <linearGradient id="copper-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <polygon points={areaStr} fill="url(#copper-grad)" />

        {/* Line */}
        <polyline
          points={ptStr}
          fill="none"
          stroke="#f97316"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Current price dot */}
        <circle cx={lastX2} cy={lastY} r={4} fill="#f97316" />

        {/* X-axis tick labels */}
        {tickIndices.map((idx) => (
          <text
            key={idx}
            x={toX(idx)}
            y={height + 16}
            textAnchor={idx === 0 ? 'start' : idx === points.length - 1 ? 'end' : 'middle'}
            fontSize={9}
            fill="#9ca3af"
          >
            {formatDate(points[idx].date)}
          </text>
        ))}
      </svg>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Public props
// ---------------------------------------------------------------------------
export interface CopperPriceChartProps {
  data: CopperPriceData;
  /** Animation index for staggered entrance */
  index?: number;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function CopperPriceChart({ data, index = 0 }: CopperPriceChartProps) {
  const pctChange = (((data.currentPrice - data.priceMonthAgo) / data.priceMonthAgo) * 100).toFixed(1);
  const isUp = data.currentPrice > data.priceMonthAgo;

  const formattedDate = new Date(data.lastUpdated).toLocaleString('default', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
    >
      <Card
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider' }}
        data-testid="copper-price-chart"
      >
        <CardContent sx={{ pb: '16px !important' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                <Typography fontSize={20} lineHeight={1}>🪙</Typography>
                <Typography variant="subtitle1" fontWeight={700}>
                  Copper Price Index
                </Typography>
                <Chip
                  label="Live Mock"
                  size="small"
                  color="warning"
                  variant="outlined"
                  sx={{ fontSize: 10, height: 18, '& .MuiChip-label': { px: 0.75 } }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                Last updated: {formattedDate} · Wire &amp; conduit cost driver
              </Typography>
            </Box>

            {/* Current price badge */}
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h5" fontWeight={800} color="warning.main" lineHeight={1}>
                ${data.currentPrice.toFixed(2)}
                <Typography component="span" variant="caption" color="text.secondary" fontWeight={400}>
                  {' '}/ lb
                </Typography>
              </Typography>
              <Tooltip
                title={`Up from $${data.priceMonthAgo.toFixed(2)}/lb 30 days ago`}
                placement="bottom"
                arrow
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mt: 0.25,
                    cursor: 'default',
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color={isUp ? 'error.main' : 'success.main'}
                  >
                    {isUp ? '↑' : '↓'} {pctChange}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    vs 30d ago
                  </Typography>
                </Box>
              </Tooltip>
            </Box>
          </Box>

          {/* Chart */}
          <CopperAreaChart points={data.points} />

          {/* Impact summary */}
          <Box
            sx={{
              mt: 1.5,
              p: 1.25,
              borderRadius: 1.5,
              bgcolor: 'error.50',
              border: '1px solid',
              borderColor: 'error.100',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography fontSize={16} lineHeight={1}>⚠️</Typography>
            <Typography variant="caption" color="error.dark" fontWeight={500}>
              Estimated impact on open bids:{' '}
              <strong>+${data.estimatedImpact.toLocaleString()}</strong> if repriced today.
              Review copper-sensitive estimates to protect your margins.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default CopperPriceChart;
