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

const getReportByDateAndToken = (date: number, token: string) => {
  throw new Error("Function getReportByDateAndToken not implemented.")
}

const getReportByDate = (date: number) => {
  throw new Error("Function getReportByDate not implemented.")
}

const getReportByToken = (token: string) => {
  throw new Error("Function getReportByToken not implemented.")
}

const getReportForEntirePortfolio = () => {
  throw new Error("Function getReportForEntirePortfolio not implemented.")
}
