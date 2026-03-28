import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';

interface MetricChipProps extends Omit<ChipProps, 'label' | 'icon'> {
  /** Human-readable metric label (e.g. "8h logged", "$22k budget") */
  label: string;
  /** Optional leading emoji/character prefix */
  prefix?: string;
}

/**
 * A compact chip for displaying a scalar metric value inline —
 * e.g. hours logged, budget amount, item count.
 */
export function MetricChip({ label, prefix, size = 'small', ...rest }: MetricChipProps) {
  return (
    <Chip
      label={prefix ? `${prefix} ${label}` : label}
      variant="outlined"
      size={size}
      sx={{ fontSize: 11, fontWeight: 500, ...rest.sx }}
      {...rest}
    />
  );
}

export default MetricChip;
