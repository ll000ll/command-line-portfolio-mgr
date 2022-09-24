import BigNumber from "bignumber.js"

import createReadStream from "./createReadStream"
import { getPriceFromApi } from "./apiFetcher"
import { defaultSeed } from "./defaultValues"
import { tokenPriceMultiplier, tokensAmountsPrinter } from "./utils/tokenUtils"

const rl = createReadStream(defaultSeed.folder, defaultSeed.file)

export const processReport = (date?: number, token?: string) => {
  if (date && token) {
    getReportByDateAndToken(date, token)
  }
  if (date && !token) {
    getReportByDate(date)
  }
  if (token && !date) {
    getReportByToken(token)
  }
  if (!token && !date) {
    getReportForEntirePortfolio()
  }
}

const getReportByDateAndToken = async (
  date: number,
  tokenRequested: string
) => {
  let tokenAmount = new BigNumber(0)

  for await (const line of rl) {
    const [timestamp, transaction_type, token, amount] = line.split(",")

    if (parseInt(timestamp) <= date) {
      if (tokenRequested === token) {
        if (transaction_type === "DEPOSIT") {
          tokenAmount = tokenAmount.plus(amount)
        }
        if (transaction_type === "WITHDRAWAL") {
          tokenAmount = tokenAmount.minus(amount)
        }
      }
    }
  }

  const tokenPrices = await getPriceFromApi()
  const requestedTokenPrice = tokenPrices[tokenRequested].USD

  console.log(`You have ${tokenAmount} ${tokenRequested}`)
  console.log(
    `Current value of ${tokenRequested} in portfolio up until the date ${date} is ${tokenAmount.multipliedBy(
      new BigNumber(requestedTokenPrice)
    )} USD`
  )
}

const getReportByDate = async (date: number) => {
  const tokens: any = {}

  for await (const line of rl) {
    const [timestamp, transaction_type, token, amount] = line.split(",")

    if (!(token in tokens)) {
      // TODO dynamically update the crypto compare api url to support other than the hardcoded tokens
      tokens[token] = new BigNumber(0)
    }
    if (parseInt(timestamp) <= date) {
      if (transaction_type === "DEPOSIT") {
        tokens[token] = tokens[token].plus(amount)
      }
      if (transaction_type === "WITHDRAWAL") {
        tokens[token] = tokens[token].minus(amount)
      }
    }
  }

  const tokensAmountsInUSD = tokenPriceMultiplier(
    tokens,
    await getPriceFromApi()
  )
  tokensAmountsPrinter(tokensAmountsInUSD)
}

const getReportByToken = async (tokenRequested: string) => {
  let tokenAmount = new BigNumber(0)

  for await (const line of rl) {
    const [timestamp, transaction_type, token, amount] = line.split(",")

    if (tokenRequested === token) {
      if (transaction_type === "DEPOSIT") {
        tokenAmount = tokenAmount.plus(amount)
      }
      if (transaction_type === "WITHDRAWAL") {
        tokenAmount = tokenAmount.minus(amount)
      }
    }
  }

  const tokenPrices = await getPriceFromApi()
  const requestedTokenPrice = tokenPrices[tokenRequested].USD

  console.log(`You have ${tokenAmount} ${tokenRequested}`)
  console.log(
    `Current value of ${tokenRequested} in portfolio is ${tokenAmount.multipliedBy(
      new BigNumber(requestedTokenPrice)
    )} USD`
  )
}

const getReportForEntirePortfolio = () => {
  throw new Error("Function getReportForEntirePortfolio not implemented.")
}
