import Link from 'next/link'
import Header from '../components/Header'

export default function Home() {
  return (
    <div className="container">
      <Header />
      <main>
        <nav className="nav">
          <Link href="/tokens">Tokens List</Link>
          <Link href="/add-token">Add Token</Link>
        </nav>

        <section className="hero">
          <h2>Live Crypto Tokens</h2>
          <p>Browse tokens, search a token, and click to view detail and redirect to popular sites.</p>
          <Link href="/tokens" className="btn">Browse tokens</Link>
        </section>
      </main>
    </div>
  )
}
