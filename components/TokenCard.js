import Link from 'next/link'

export default function TokenCard({ token }) {
  const vs = process.env.NEXT_PUBLIC_DEFAULT_VS_CURRENCY || 'usd'
  const currencySymbols = { usd: '$', eur: '€', gbp: '£' }
  const cs = currencySymbols[vs] || vs.toUpperCase() + ' '
  return (
    <div className="card">
      <img src={token.image || '/placeholder-coin.png'} alt={token.name} width={40} height={40} />
      <div className="card-body">
        <h3>{token.name} <small>({(token.symbol || '').toUpperCase()})</small></h3>
        <p>{token.current_price === 'N/A' ? '' : `${cs}${typeof token.current_price === 'number' ? token.current_price.toLocaleString() : token.current_price}`}{token.market_cap_rank ? ` • #${token.market_cap_rank}` : ''}</p>
      </div>
      <div className="card-actions">
        <Link href={`/tokens/${token.id}`} className="btn small">Details</Link>
        {token.id && !token.custom && (
          <a href={`https://www.coingecko.com/en/coins/${token.id}`} className="btn small" target="_blank" rel="noopener noreferrer">CoinGecko</a>
        )}
        {token.platform_contract && (
          <a href={`https://app.uniswap.org/#/swap?outputCurrency=${token.platform_contract}`} className="btn small" target="_blank" rel="noopener noreferrer">Buy</a>
        )}
      </div>
    </div>
  )
}
