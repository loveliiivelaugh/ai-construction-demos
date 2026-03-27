import { Card, CardContent, Typography } from '@mui/material';
import { useExampleFeatureStore } from '@store/exampleFeatureStore';
import { useExampleFeature } from '../hooks/useExampleFeature';

export default function ExampleCard() {
  const count = useExampleFeatureStore((s) => s.count);
  const increment = useExampleFeatureStore((s) => s.increment);
  const { label } = useExampleFeature();

  return (
    <Card>
      <CardContent>
        <Typography variant="overline" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h6" sx={{ mt: 1 }}>
          Counter: {count}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Click to update local feature state.
        </Typography>
        <Typography
          role="button"
          tabIndex={0}
          onClick={increment}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') increment();
          }}
          sx={{ mt: 2, fontWeight: 600, cursor: 'pointer' }}
        >
          Increment
        </Typography>
      </CardContent>
    </Card>
  );
}
