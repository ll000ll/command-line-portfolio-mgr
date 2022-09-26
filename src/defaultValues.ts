export const defaultSeed = {
  folder: "../seed",
  file: "txs.csv",
}

export const defaultFetchPricesUrl = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP&tsyms=USD&api_key=${process.env.CRYPTO_COMPARE_API_KEY}`

export const defaultReportName = "Report took:"
