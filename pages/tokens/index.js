import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import api from '../../lib/api'
import TokenCard from '../../components/TokenCard'

export default function TokensIndex() {
  const [tokens, setTokens] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true)
      try {
        const res = await api.get('/coins/markets', {
          params: {
            vs_currency: process.env.NEXT_PUBLIC_DEFAULT_VS_CURRENCY || 'usd',
            order: 'market_cap_desc',
            per_page: 250,
            page: 1,
            sparkline: false
          }
        })
        // merge any custom local tokens into the list and ensure local ones are at top
        const local = JSON.parse(localStorage.getItem('custom_tokens') || '[]')
        const mapped = (local || []).map((t, idx) => ({ id: `custom:${t.name.replace(/\s+/g, '_').toLowerCase()}_${idx}`, custom:true, name: t.name, symbol: t.symbol, current_price: 'N/A', image: '/placeholder-coin.png', platform_contract: t.address }))
        setTokens([...mapped, ...res.data])
      } catch (e) {
        console.error('Failed to fetch tokens', e)
      }
      setLoading(false)
    }
    fetchTokens()
  }, [])

  const filtered = tokens.filter(t => t.name.toLowerCase().includes(query.toLowerCase()) || t.symbol.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="container">
      <Header />
      <main>
        <div className="controls">
          <input placeholder="Search by name or symbol" value={query} onChange={e => setQuery(e.target.value)} />
        </div>

        {loading ? <p>Loading tokens...</p> : (
          <section className="grid">
            {filtered.map(t => (
              <TokenCard key={t.id} token={t} />
            ))}
          </section>
        )}
      </main>
    </div>
  )
}
