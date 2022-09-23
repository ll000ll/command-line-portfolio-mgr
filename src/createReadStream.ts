import fs from "fs"
import readline from "readline"
import path from "path"

const rl = (folder: string, file: string) =>
  readline.createInterface({
    input: fs.createReadStream(path.resolve(__dirname, folder, file)),
    output: process.stdout,
    terminal: false,
  })

export default rl
