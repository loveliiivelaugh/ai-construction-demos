// @lib/slack.ts

export async function sendSlackErrorAlert(log: {
  request_id: string
  source: string
  message: string
  metadata?: Record<string, any>
}) {
  const webhookUrl = process.env.SLACK_ALERT_WEBHOOK_URL
  if (!webhookUrl) return

  const blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `🚨 *Error Alert from ${log.source}*`
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Message:* ${log.message}`
      }
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `*Request ID:* ${log.request_id}`
        }
      ]
    },
    {
      type: 'divider'
    }
  ]

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocks })
  })
}
