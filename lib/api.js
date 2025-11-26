import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.coingecko.com/api/v3'
const headers = {}
if (process.env.NEXT_PUBLIC_COINGECKO_API_KEY) {
  headers['x-cg-pro-api-key'] = process.env.NEXT_PUBLIC_COINGECKO_API_KEY
}

const api = axios.create({ baseURL, headers })
export default api
