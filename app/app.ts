import express, { Application } from 'express'
import { initRoutes } from './routes'

require('dotenv').config()

export const app: Application = express()

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})

initRoutes(app)
