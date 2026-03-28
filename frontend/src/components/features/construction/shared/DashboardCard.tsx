import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  /** Animation index — controls staggered entrance delay */
  index?: number;
  /** Optional header action (e.g. a button or chip) */
  action?: React.ReactNode;
  children: React.ReactNode;
  sx?: object;
}

/**
 * Reusable animated card for dashboard sections.
 * Wraps content with a consistent border, elevation, and staggered
 * framer-motion entrance animation.
 */
export function DashboardCard({
  title,
  subtitle,
  index = 0,
  action,
  children,
  sx,
}: DashboardCardProps) {
  return (
    <MotionCard
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      elevation={0}
      sx={{ border: '1px solid', borderColor: 'divider', height: '100%', ...sx }}
    >
      <CardContent>
        {(title || action) && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            {title && (
              <Box>
                <Typography variant="subtitle1" fontWeight={700} lineHeight={1.3}>
                  {title}
                </Typography>
                {subtitle && (
                  <Typography variant="caption" color="text.secondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>
            )}
            {action && <Box sx={{ ml: 1, flexShrink: 0 }}>{action}</Box>}
          </Box>
        )}
        {children}
      </CardContent>
    </MotionCard>
  );
}

export default DashboardCard;
