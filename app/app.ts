import express, { Application } from 'express'
import morgan from 'morgan'
import path from 'path'
import { config } from 'dotenv'
import { initRoutes } from './routes'

config()

const environment = process.env.NODE_ENV || 'development'

export const app: Application = express()
app.use(morgan(environment === 'development' ? 'dev' : 'combined'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})

initRoutes(app)
