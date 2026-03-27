// @lib/logSystemEvent.ts
// import { supabase, supabaseLocal } from '@config/supabase.config'
import { sendSlackErrorAlert } from './logErrorToSlack'

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

const silent = true;

export async function logSystemEvent({
  level = 'info',
  source,
  message,
  metadata = {},
  request
}: {
  level?: LogLevel
  source: string
  message: string
  metadata?: Record<string, any>
  request?: Request
}) {
  const request_id = crypto.randomUUID()

  const ip = request?.headers.get('x-forwarded-for') ?? 'unknown'
  const ua = request?.headers.get('user-agent') ?? 'unknown'

  const log = {
    request_id,
    level,
    source,
    message,
    metadata,
    ip_address: ip,
    user_agent: ua,
    created_at: new Date().toISOString()
  }

  try {
    // TODO: Add system logs back again later. Right now system logs are disabled
    // await supabaseLocal.from('system_logs').insert(log)
    if (level === 'error') {
      console.error(`🧨 [${source}] ${message}`, metadata)
      await sendSlackErrorAlert(log)
    } else if (!silent) {
      console.info(`✏️ [${source}] ${message}`, metadata)
    }
  } catch (err: any) {
    console.error('❌ Failed to insert system log', err.message)
  }

  return log
}
