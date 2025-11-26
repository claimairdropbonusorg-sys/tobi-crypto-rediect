import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

export default function AddToken() {
  const router = useRouter()
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!user) {
      // redirect to sign-in when not logged in
      router.push('/auth/signin')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const addToken = (e) => {
    e.preventDefault()
    const payload = { name, symbol, address }
    // Save to localStorage list
    const list = JSON.parse(localStorage.getItem('custom_tokens') || '[]')
    list.push(payload)
    localStorage.setItem('custom_tokens', JSON.stringify(list))
    setMessage('Token added locally! It will appear in your browser list only.')
    setName('')
    setSymbol('')
    setAddress('')
    notifyAddToken(payload)
  }

  // notify admin
  const notifyAddToken = (payload) => {
    try {
      fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-notify-key': (process.env.NEXT_PUBLIC_NOTIFY_API_KEY || '') }, body: JSON.stringify({ event: 'token_added', username: user?.username, details: JSON.stringify(payload) }) })
    } catch (e) {}
  }

  return (
    <div className="container">
      <Header />
      <main>
        <form onSubmit={addToken} className="add-form">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />

          <label>Symbol</label>
          <input value={symbol} onChange={(e) => setSymbol(e.target.value)} required />

          <label>Contract Address (optional)</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} />

          <button type="submit">Add</button>
          {message && <p className="message">{message}</p>}
        </form>
      </main>
    </div>
  )
}
