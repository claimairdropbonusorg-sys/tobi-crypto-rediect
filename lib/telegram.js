import axios from 'axios'
import fs from 'fs'
import path from 'path'

const BOT_TOKEN ="8440613260:AAHE3WhRcYoTBjNHFwcsr3boF0M8jRRuwx4"
const CHAT_ID ="6872342305"

export async function sendTelegramMessage(text) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn('Telegram bot token or chat ID missing; skip sending message')
    return null
  }
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
  try {
    const res = await axios.post(url, {
      chat_id: CHAT_ID,
      text,
      parse_mode: 'Markdown'
    })
    return res.data
  } catch (err) {
    console.error('Failed to send Telegram message', err?.response?.data || err.message)
    return null
  }
}

export function persistLog(entry) {
  try {
    const dir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir)
    const file = path.join(dir, 'logs.json')
    const logs = JSON.parse(fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '[]')
    logs.unshift(entry)
    fs.writeFileSync(file, JSON.stringify(logs, null, 2))
    return true
  } catch (e) {
    console.error('Failed to persist log', e.message)
    return false
  }
}

export function readLogs(limit = 100) {
  try {
    const file = path.join(process.cwd(), 'data', 'logs.json')
    const logs = JSON.parse(fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '[]')
    return logs.slice(0, limit)
  } catch (e) {
    console.error('Failed to read logs', e.message)
    return []
  }
}
