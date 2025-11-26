#!/usr/bin/env node
const axios = require('axios')
const path = require('path')
const fs = require('fs')

// Load .env.local if present
try {
  const dotenv = require('dotenv')
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) dotenv.config({ path: envPath })
} catch (e) {
  // ignore
}

const apiUrl = process.env.NOTIFY_TEST_URL || 'http://localhost:3000/api/notify'
const apiKey = process.env.NOTIFY_API_KEY || process.env.NEXT_PUBLIC_NOTIFY_API_KEY || ''

async function main() {
  if (!apiKey) {
    console.error('Missing NOTIFY_API_KEY or NEXT_PUBLIC_NOTIFY_API_KEY in environment (.env.local). Add one to test the notify API.')
    process.exit(1)
  }
  const event = process.argv[2] || 'token_added'
  const username = process.argv[3] || 'test-user'
  const details = process.argv[4] || 'test-notify-script'

  try {
    console.log(`Sending test notify to ${apiUrl}`)
    const res = await axios.post(apiUrl, { event, username, details }, { headers: { 'Content-Type': 'application/json', 'x-notify-key': apiKey } })
    console.log('Response status:', res.status)
    console.log('Response data:', res.data)
  } catch (err) {
    if (err.response) {
      console.error('Server responded with error:', err.response.status, err.response.data)
    } else {
      console.error('Request failed:', err.message)
    }
    process.exit(1)
  }
}

main()
