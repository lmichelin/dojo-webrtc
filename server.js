const express = require("express")
const https = require("https")
const fs = require("fs")
const socketIO = require("socket.io")

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

const io = socketIO(httpsServer)

io.on("connection", socket => {
  socket.on("offer", signal => {
    socket.broadcast.emit("offer", signal)
  })

  socket.on("answer", answer => {
    socket.broadcast.emit("answer", answer)
  })
})

const server = httpsServer.listen(port, () => {
  console.log(`Server listening at https://localhost:${port}`)
})
