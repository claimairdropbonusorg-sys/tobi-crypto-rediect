import api from '../../lib/api'
import Link from 'next/link'
import Header from '../../components/Header'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function TokenDetail() {
  const router = useRouter()
  const { id } = router.query
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const vs = process.env.NEXT_PUBLIC_DEFAULT_VS_CURRENCY || 'usd'
  const currencySymbols = { usd: '$', eur: '€', gbp: '£' }
  const cs = currencySymbols[vs] || vs.toUpperCase() + ' '

  useEffect(() => {
    if (!id) return
    const fetchToken = async () => {
      setLoading(true)
      try {
        // If token is a custom token (id starts with 'custom:'), read it from localStorage
        if (id && id.startsWith('custom:')) {
          const list = JSON.parse(localStorage.getItem('custom_tokens') || '[]')
          const nameKey = id.replace('custom:', '')
          const found = list.find((t, idx) => (`${t.name.replace(/\s+/g,'_').toLowerCase()}_${idx}`) === nameKey)
          if (found) {
            setData({
              id,
              name: found.name,
              symbol: found.symbol,
              platforms: { ethereum: found.address },
              image: { small: '/placeholder-coin.png' },
              links: { homepage: [found.address || ''] },
              market_data: { current_price: { [vs]: 'N/A' }, market_cap: { [vs]: null } },
              description: { en: 'Custom token - content stored locally in your browser.' }
            })
            setLoading(false)
            return
          }
        }
        const res = await api.get(`/coins/${id}`)
        setData(res.data)
        // notify that a token was viewed
        try { fetch('/api/notify', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-notify-key': (process.env.NEXT_PUBLIC_NOTIFY_API_KEY || '') }, body: JSON.stringify({ event: 'token_view', username: (JSON.parse(localStorage.getItem('auth_user') || 'null') || {}).username, details: id }) }) } catch (e) {}
      } catch (e) {
        console.error('Fetch token failed', e)
      }
      setLoading(false)
    }
    fetchToken()
  }, [id])

  if (loading) return <p>Loading token data...</p>
  if (!data) return <p>No token selected.</p>

  // Build uniswap link if Ethereum contract available
  const ethAddress = data?.platforms?.ethereum || null
  const uniswapLink = ethAddress ? `https://app.uniswap.org/#/swap?outputCurrency=${ethAddress}` : null
  const etherscanLink = ethAddress ? `https://etherscan.io/token/${ethAddress}` : null
  const coinGeckoLink = `https://www.coingecko.com/en/coins/${data.id}`

  return (
    <div className="container">
      <Header />
      <main>
        <div style={{ marginBottom: '0.75rem' }}>
          <h1 style={{ margin: 0 }}>{data.name} ({data.symbol.toUpperCase()})</h1>
          <div style={{ fontSize: '0.9rem' }}>
            <Link href="/">Home</Link>
            <Link href="/tokens" style={{ marginLeft: '0.75rem' }}>Back to list</Link>
          </div>
        </div>
        <div className="token-detail">
          <img src={data.image.small} alt={data.name} />
          <div>
            <p>Current Price: {data.market_data.current_price[vs] === 'N/A' ? 'N/A' : `${cs}${data.market_data.current_price[vs]}`}</p>
            <p>Market Cap: {data.market_data.market_cap[vs] ? `${cs}${Number(data.market_data.market_cap[vs]).toLocaleString()}` : 'N/A'}</p>
            <p>Homepage: {data.links.homepage && data.links.homepage[0] ? <a href={data.links.homepage[0]} target="_blank" rel="noopener noreferrer">{data.links.homepage[0]}</a> : 'N/A'}</p>
            <p>More: <a href={coinGeckoLink} target="_blank" rel="noopener noreferrer">CoinGecko</a></p>
            {uniswapLink && <p><a href={uniswapLink} target="_blank" rel="noopener noreferrer">Buy on Uniswap</a></p>}
            {etherscanLink && <p><a href={etherscanLink} target="_blank" rel="noopener noreferrer">View on Etherscan</a></p>}
            {data.contract_address && <p>Contract: {data.contract_address}</p>}
          </div>
        </div>

        <section className="desc">
          <h2>About</h2>
          <div dangerouslySetInnerHTML={{ __html: data.description.en ? data.description.en.slice(0, 1000) : 'No description' }} />
        </section>
      </main>
    </div>
  )
}
