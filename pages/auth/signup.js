import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../../context/AuthContext'
import Header from '../../components/Header'

export default function Signup() {
  const router = useRouter()
  const { signup } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    try {
      signup({ username, password })
      router.push('/')
    } catch (err) {
      // notify failed signup
      try { fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'user_signup_failed', username, details: err.message }) }) } catch (e) {}
      setError(err.message || 'Signup failed')
    }
  }

  return (
    <div className="container">
      <Header />
      <main>
        <h1>Sign up</h1>
        <form onSubmit={onSubmit} className="add-form">
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />

          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button type="submit">Sign up</button>
          {error && <p className="message" style={{ color: '#ffb3b3' }}>{error}</p>}
        </form>
        <p>Already have an account? <Link href="/auth/signin">Sign in</Link></p>
      </main>
    </div>
  )
}
