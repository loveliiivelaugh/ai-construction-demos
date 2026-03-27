// @lib/withHandler.ts
import type { Context } from 'hono'
import { incrementMetric } from '@utilities/lib/handleMetrics';
import { logSystemEvent } from './logSystemEvent'
import { recordMetric } from './recordMetric'

type HandlerOptions = {
  logLevel?: 'info' | 'warn' | 'error' | 'debug'
  disableLog?: boolean
  hitlPending?: boolean
  successStatusCode?: number
  errorMessage?: string
}

export function withHandler(
  source: string,
  handler: (c: Context) => Promise<Response | any>,
  options: HandlerOptions = {}
) {
  return async (c: Context) => {
    const trace_id = c.req.header('x-trace-id') ?? crypto.randomUUID()
    const request = c.req.raw
    const meta = {
      trace_id,
      ip: c.req.header('x-forwarded-for') ?? 'unknown',
      ua: c.req.header('user-agent') ?? 'unknown',
      url: c.req.url,
      method: c.req.method,
    }

    if (!options.disableLog) {
      await logSystemEvent({
        level: options.logLevel ?? 'info',
        source,
        message: `Incoming request: ${c.req.method} ${c.req.url}`,
        metadata: meta,
        request,
      })
    }

    try {
      c.header('Access-Control-Allow-Origin', 'https://agentflow.woodwardwebdev.com');
      c.header('Access-Control-Allow-Credentials', 'true');
      c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      c.header('Access-Control-Max-Age', '3600');
      
      const result = await handler(c)
      const status = result?.status ?? options.successStatusCode ?? 200

      // 🔁 Metric tracking for returned statuses
      if (status === 401) recordMetric('aegis_request_401', { trace_id, source, request })
      if (status === 403) recordMetric('aegis_request_403', { trace_id, source, request })
      if (status >= 500) recordMetric('aegis_request_500', { trace_id, source, request })

      if (!options.disableLog) {
        await logSystemEvent({
          level: options.logLevel ?? 'info',
          source,
          message: `Success: ${c.req.method} ${c.req.url}`,
          metadata: {
            ...meta,
            status,
          },
          request,
        })
      }

      if (options.hitlPending) {
        await logSystemEvent({
          level: 'info',
          source,
          message: `🧍 HITL review required`,
          metadata: { ...meta, type: 'hitl-pending' },
          request,
        })
      }

      return result
    } catch (err: any) {
      console.error('🧨 Route error:', err)

      recordMetric('aegis_request_500', { trace_id, source, request })

      // await logSystemEvent({
      //   level: 'error',
      //   source,
      //   message: `Error in ${c.req.method} ${c.req.url}`,
      //   metadata: {
      //     ...meta,
      //     error: err?.message || 'Unknown error',
      //     stack: err?.stack || null,
      //   },
      //   request,
      // })

      return c.json(
        {
          error: options.errorMessage ?? 'Internal Server Error',
          trace_id,
        },
        500
      )
    }
  }
}
