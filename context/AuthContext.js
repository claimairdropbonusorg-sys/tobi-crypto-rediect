import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('auth_user') || 'null')
      setUser(u)
    } catch (e) {
      setUser(null)
    }
  }, [])

  const signup = ({ username, password }) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    // Check if username exists
    if (users.find(u => u.username === username)) {
      // notify failed signup attempt
      try { fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'user_signup_failed', username, details: 'username exists' }) }) } catch (e) {}
      throw new Error('Username already exists')
    }
    const newUser = { username, password }
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))
    localStorage.setItem('auth_user', JSON.stringify({ username }))
    setUser({ username })
    // Notify admin of a new signup event
    try { fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-notify-key': (process.env.NEXT_PUBLIC_NOTIFY_API_KEY || '') }, body: JSON.stringify({ event: 'user_signup', username }) }) } catch (e) {}
    return { username }
  }

  const signin = ({ username, password }) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const found = users.find(u => u.username === username && u.password === password)
    if (!found) {
      try { fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'user_signin_failed', username, details: 'invalid creds' }) }) } catch (e) {}
      throw new Error('Invalid credentials')
    }
    localStorage.setItem('auth_user', JSON.stringify({ username }))
    setUser({ username })
    try { fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-notify-key': (process.env.NEXT_PUBLIC_NOTIFY_API_KEY || '') }, body: JSON.stringify({ event: 'user_signin', username }) }) } catch (e) {}
    return { username }
  }

  const signout = () => {
    localStorage.removeItem('auth_user')
    setUser(null)
    try { fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-notify-key': (process.env.NEXT_PUBLIC_NOTIFY_API_KEY || '') }, body: JSON.stringify({ event: 'user_signout', username: user?.username }) }) } catch (e) {}
  }

  return (
    <AuthContext.Provider value={{ user, signup, signin, signout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
