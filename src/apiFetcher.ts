// https://bobbyhadz.com/blog/javascript-error-err-require-esm-of-es-module-node-fetch
const fetch = require("node-fetch")

let crypto_CompareUrl = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP&tsyms=USD&api_key=${process.env.CRYPTO_COMPARE_API_KEY}`

const defaultPriveProviderUrl = crypto_CompareUrl

export const getPriceFromApi = async (priceProviderUrl?: string) => {
  const url = priceProviderUrl || defaultPriveProviderUrl
  const response = await fetch(url)
  const data = await response.json()
  return data
}
