import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './db.js'
import routes from './routes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use('/', routes)

connectDB()

app.listen(PORT, () => {
  console.log(`Server listening in http://localhost:${PORT}`)
})