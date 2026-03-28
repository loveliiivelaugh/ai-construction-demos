import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material';

type ConstructionStatus =
  | 'pending'
  | 'active'
  | 'completed'
  | 'draft'
  | 'sent'
  | 'signed'
  | 'needed'
  | 'ordered'
  | 'delivered'
  | 'todo'
  | 'in-progress'
  | 'done'
  | string;

const STATUS_COLOR_MAP: Record<string, ChipProps['color']> = {
  pending: 'warning',
  active: 'success',
  completed: 'default',
  draft: 'default',
  sent: 'info',
  signed: 'success',
  needed: 'warning',
  ordered: 'info',
  delivered: 'success',
  todo: 'default',
  'in-progress': 'primary',
  done: 'success',
};

interface StatusChipProps extends Omit<ChipProps, 'color' | 'label'> {
  status: ConstructionStatus;
  /** Override the display label; defaults to the raw status value */
  label?: string;
}

/**
 * Displays a construction entity status with consistent colour semantics
 * across the portal (jobs, projects, materials, contracts, tasks).
 */
export function StatusChip({ status, label, size = 'small', ...rest }: StatusChipProps) {
  const color = STATUS_COLOR_MAP[status] ?? 'default';
  return (
    <Chip
      label={label ?? status}
      color={color}
      size={size}
      sx={{ fontSize: 11, textTransform: 'capitalize', ...rest.sx }}
      {...rest}
    />
  );
}

export default StatusChip;
