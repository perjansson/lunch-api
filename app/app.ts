require('dotenv').config()

import express, { Application } from 'express'
import morgan from 'morgan'
import path from 'path'
import bodyParser from 'body-parser'
import cors from 'cors'
import { initRoutes } from './routes'
import { validateAPI } from './shared/middlewares'
import { ALLOWED_ORIGINS } from './shared/constants'

const environment = process.env.NODE_ENV || 'development'

export const app: Application = express()
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
  })
)
app.use(morgan(environment === 'development' ? 'dev' : 'combined'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

app.use(
  '/api',
  validateAPI({
    exlucedPaths: ['/slack'],
    exlucedOrigins: ALLOWED_ORIGINS,
  })
)

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})

initRoutes(app)
