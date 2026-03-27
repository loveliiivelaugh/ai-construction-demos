import { describe, expect, it } from 'bun:test';
import { getMetrics, incrementMetric } from '../src/utilities/lib/handleMetrics';

describe('handleMetrics', () => {
  it('increments metrics safely', () => {
    const before = { ...getMetrics() };

    incrementMetric('aegis_request_401');

    const after = getMetrics();
    expect(after.aegis_request_401).toBe(before.aegis_request_401 + 1);
  });
});
