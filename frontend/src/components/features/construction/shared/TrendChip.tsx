import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';

type TrendDirection = 'up' | 'down' | 'neutral';

interface TrendChipProps extends Omit<ChipProps, 'color' | 'label'> {
  /** Percentage change value (positive or negative number) */
  value: number;
  /** Override automatic direction detection */
  direction?: TrendDirection;
  /** Show a "%" suffix (default true) */
  showPercent?: boolean;
}

const TREND_ICON: Record<TrendDirection, string> = {
  up: '↑',
  down: '↓',
  neutral: '→',
};

const TREND_COLOR: Record<TrendDirection, ChipProps['color']> = {
  up: 'success',
  down: 'error',
  neutral: 'default',
};

/**
 * Displays a numeric trend (e.g. week-over-week change) with directional
 * colour coding: green for positive, red for negative, grey for flat.
 */
export function TrendChip({ value, direction, showPercent = true, size = 'small', ...rest }: TrendChipProps) {
  const dir: TrendDirection = direction ?? (value > 0 ? 'up' : value < 0 ? 'down' : 'neutral');
  const absValue = Math.abs(value);
  const label = `${TREND_ICON[dir]} ${absValue}${showPercent ? '%' : ''}`;

  return (
    <Chip
      label={label}
      color={TREND_COLOR[dir]}
      size={size}
      sx={{ fontSize: 11, fontWeight: 600, ...rest.sx }}
      {...rest}
    />
  );
}

export default TrendChip;
