import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

export default function Header() {
  const { user, signout } = useAuth()
  const router = useRouter()
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
      <div>
        <h1 style={{ margin: 0 }}>Tobi Crypto Redirect</h1>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>Search and redirect to token details. Powered by CoinGecko API.</p>
      </div>
      <div className="nav" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Link href="/">Home</Link>
        <Link href="/tokens">Tokens</Link>
        <Link href="/add-token">Add Token</Link>
        {user ? (
          <>
            <span style={{ color: '#9be7ff' }}>Signed in: {user.username}</span>
            <button onClick={() => { signout(); router.push('/') }} className="btn">Sign out</button>
          </>
        ) : (
          <>
            <Link href="/auth/signin" className="btn">Sign in</Link>
            <Link href="/auth/signup" className="btn">Sign up</Link>
          </>
        )}
      </div>
    </header>
  )
}
