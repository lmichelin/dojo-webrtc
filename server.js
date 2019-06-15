const fs = require("fs")
const express = require("express")
const https = require("https")
const socketIO = require("socket.io")

const app = express()

app.use(express.static("public"))

const httpsServer = https.createServer(
  {
    key: fs.readFileSync("ssl.key"),
    cert: fs.readFileSync("ssl.crt"),
  },
  app,
)

const io = socketIO(httpsServer)

io.on("connection", socket => {
  socket.on("clientSignal", signal => {
    socket.broadcast.emit("otherClientSignal", signal)
  })
})

httpsServer.listen(8443, () => {
  console.log("Server listening at https://localhost:8443")
})
