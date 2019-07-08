const express = require("express")
const http = require("http")
const fs = require("fs")
const socketIO = require("socket.io")

const port = 8443

const app = express()

app.use(express.static("public"))

const httpsServer = http.createServer(
  app,
)

const io = socketIO(httpsServer)

io.on("connection", socket => {
  socket.on("offer", offer => {
    socket.broadcast.emit("offer", offer)
  })

  socket.on("answer", answer => {
    socket.broadcast.emit("answer", answer)
  })

  socket.on("icecandidate", candidate => {
	  socket.broadcast.emit("icecandidate", candidate)
  })
})

const server = httpsServer.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
