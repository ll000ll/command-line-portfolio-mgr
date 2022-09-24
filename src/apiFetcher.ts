// https://bobbyhadz.com/blog/javascript-error-err-require-esm-of-es-module-node-fetch
const fetch = require("node-fetch")

import { defaultFetchPricesUrl } from "./defaultValues"

export const getPriceFromApi = async (priceProviderUrl?: string) => {
  const url = priceProviderUrl || defaultFetchPricesUrl
  const response = await fetch(url)
  const data = await response.json()
  return data
}
