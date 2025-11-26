import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Link from 'next/link'

export default function AdminLogs() {
  const [logs, setLogs] = useState([])
  const [secret, setSecret] = useState('')
  const [error, setError] = useState('')

  const fetchLogs = async (s) => {
    setError('')
    try {
      const res = await fetch(`/api/logs?secret=${encodeURIComponent(s)}`)
      if (!res.ok) {
        throw new Error('Forbidden')
      }
      const data = await res.json()
      setLogs(data.logs || [])
    } catch (e) {
      setError('Failed to fetch logs')
    }
  }

  return (
    <div className="container">
      <Header />
      <main>
        <h1>Admin: Logs</h1>
        <p>Enter the admin secret to view log events</p>
        <input value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Admin secret" />
        <button onClick={() => fetchLogs(secret)}>Load logs</button>
        {error && <p style={{ color: '#ffb3b3' }}>{error}</p>}
        <section style={{ marginTop: '1rem' }}>
          {logs.length === 0 ? <p>No logs</p> : (
            <ul>
              {logs.map((l, idx) => (
                <li key={idx}><strong>{l.event}</strong> {l.username} at {l.timestamp} — {l.details || ''}</li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
