const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()
app.use(cors());

app.use(cors())
app.use(express.json())

app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/exams", require("./routes/examRoutes"))
app.use("/api/upload", require("./routes/uploadRoutes"))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})