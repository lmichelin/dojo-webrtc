const express = require("express")
const https = require("https")
const fs = require("fs")

const port = 8443

const app = express()

app.use(express.static("public"))

const httpsServer = https.createServer(
  {
    key: fs.readFileSync("ssl.key"),
    cert: fs.readFileSync("ssl.crt"),
  },
  app,
)

const server = httpsServer.listen(port, () => {
  console.log(`Server listening at https://localhost:${port}`)
})
