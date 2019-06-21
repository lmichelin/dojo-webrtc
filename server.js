const express = require("express")

const port = 8080

const app = express()

app.use(express.static("public"))

const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
