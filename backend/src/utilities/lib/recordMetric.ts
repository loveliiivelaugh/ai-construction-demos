// @lib/recordMetric.ts

import { incrementMetric } from './handleMetrics'
import { logSystemEvent } from './logSystemEvent'

export function recordMetric(
    name: string | 'aegis_threat_total' | 'aegis_request_401' | 'aegis_request_403' | 'aegis_request_500',
    options?: {
        trace_id?: string
        source?: string
        tags?: Record<string, string>
        request?: Request
    }
) {
    incrementMetric(name as any)

    if (options?.source) {
        logSystemEvent({
            level: 'debug',
            source: options.source,
            message: `Metric incremented: ${ name }`,
            metadata: {
                trace_id: options.trace_id ?? crypto.randomUUID(),
                ...options.tags
            },
            request: options.request
        })
    }
}

