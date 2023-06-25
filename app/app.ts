require('dotenv').config()

import express, { Application } from 'express'
import morgan from 'morgan'
import path from 'path'
import { initRoutes } from './routes'
import { validateAPIKey } from './shared/middlewares'

const environment = process.env.NODE_ENV || 'development'

export const app: Application = express()
app.use(morgan(environment === 'development' ? 'dev' : 'combined'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

app.use('/api', validateAPIKey)

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})

initRoutes(app)
