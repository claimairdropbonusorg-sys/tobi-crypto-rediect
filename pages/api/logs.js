import { readLogs } from '../../lib/telegram'

export default function handler(req, res) {
  // Only allow admin retrieval with a shared secret in header for demo:
  const secret = req.headers['x-admin-secret'] || req.query.secret
  const ADMIN_SECRET = process.env.ADMIN_SECRET || ''
  const publicKey = req.headers['x-notify-key'] || req.query.notify_key
  const serverKey = process.env.NOTIFY_API_KEY || ''
  // Accept if the notify key equals serverKey OR ADMIN_SECRET matches
  if (!(ADMIN_SECRET && secret === ADMIN_SECRET) && !(serverKey && publicKey === serverKey)) {
    res.status(403).json({ error: 'Forbidden' })
    return
  }
  if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
    res.status(403).json({ error: 'Forbidden' })
    return
  }
  const logs = readLogs(200)
  res.status(200).json({ logs })
}
