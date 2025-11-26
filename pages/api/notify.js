import { sendTelegramMessage, persistLog } from '../../lib/telegram'

// rate limiting memory store
const RATE_LIMIT_WINDOW = 60 * 1000 // 60 seconds
const RATE_LIMIT_MAX = 20 // max events per window per IP
const ipStore = new Map()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  const { event, username, details } = req.body || {}
  // validate known events
  const ALLOWED_EVENTS = [
    'user_signup', 'user_signin', 'user_signout', 'user_signup_failed', 'user_signin_failed',
    'token_added', 'token_view'
  ]
  if (!ALLOWED_EVENTS.includes(event)) {
    res.status(400).json({ error: 'Invalid event' })
    return
  }
  // limit details length
  const MAX_DETAILS_LEN = 512
  const safeDetails = (details || '').toString().slice(0, MAX_DETAILS_LEN)
  // Server-side protection: require a notify key
  const serverKey = process.env.NOTIFY_API_KEY
  const publicKey = process.env.NEXT_PUBLIC_NOTIFY_API_KEY
  const providedKey = (req.headers['x-notify-key'] || '').toString()
  if (serverKey) {
    // if server key set, require provided key to match either server key or public key
    if (providedKey !== serverKey && providedKey !== publicKey) {
      res.status(403).json({ error: 'Forbidden - invalid key' })
      return
    }
  }

  // Basic rate-limiting per IP
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').toString()
  const now = Date.now()
  const entry = ipStore.get(ip) || { ts: now, count: 0 }
  if (now - entry.ts < RATE_LIMIT_WINDOW) {
    entry.count += 1
  } else {
    entry.ts = now
    entry.count = 1
  }
  ipStore.set(ip, entry)
  if (entry.count > RATE_LIMIT_MAX) {
    res.status(429).json({ error: 'Rate limit exceeded' })
    return
  }
  if (!event) {
    res.status(400).json({ error: 'Event required' })
    return
  }

  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
    const timestamp = new Date().toISOString()
    const entry = { event, username: username || 'anonymous', details: safeDetails, timestamp, ip }
    // persist to file
    persistLog(entry)
    // send to telegram
    const text = `*${event}*\n*User:* ${entry.username}\n*Time:* ${entry.timestamp}\n*IP:* ${entry.ip}\n*Details:* ${entry.details}`
    await sendTelegramMessage(text)
    res.status(200).json({ ok: true })
  } catch (e) {
    console.error('notify error', e.message)
    res.status(500).json({ error: 'Failed to notify' })
  }
}
