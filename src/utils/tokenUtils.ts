export const tokenPriceMultiplier = (allTokens: any, tokenPrices: any) => {
  const tokensInUSDvalue: any = []
  if (allTokens["token"]) {
    // coming from header row in the CSV file
    delete allTokens["token"]
  }
  Object.keys(allTokens).forEach((token: string) => {
    tokensInUSDvalue.push({
      [token]: `${(tokenPrices[token].USD * allTokens[token]).toFixed(2)} USD`,
    })
  })
  return tokensInUSDvalue
}

export const tokensAmountsPrinter = (tokensWithValues: Array<Object>) => {
  tokensWithValues.forEach((tkn: any) => {
    console.log(tkn)
  })
}
