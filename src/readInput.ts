import yargs from "yargs"
import { hideBin } from "yargs/helpers"

import { processReport } from "./reportsProcessor"

interface allowedArgvs {
  token?: string | undefined
  date?: number | undefined
  help?: string
}

export const setCommandLineArgs = () => {
  const argv: allowedArgvs = yargs(hideBin(process.argv))
    .option("date", {
      alias: "d",
      type: "number",
      description:
        "Report for provided date since the Epoch (ex: --date=119158956)",
    })
    .option("token", {
      alias: "t",
      type: "string",
      description: "Report for provided token (ex: --token=ETH)",
    })
    .alias("help", "h")
    .parseSync()
  return argv
}

export const processReportCallForArgs = (argv: allowedArgvs) => {
  if (!argv.token && !argv.date && !argv.help) {
    console.log(
      "You may use --help to see available options.\n",
      "Generating report for all tokens * latest prices * latest date..."
    )
    processReport()
  } else if (argv.token && argv.date) {
    console.log(
      `Generating report for provided ${argv.token} and ${argv.date}...`
    )
    processReport(argv.date, argv.token)
  } else if (argv.token) {
    console.log(`The token selected is: ${argv.token}`)
    processReport(undefined, argv.token)
  } else if (argv.date) {
    console.log(`The date is:${argv.date}. No token is provided.`)
    processReport(argv.date)
  }
}
