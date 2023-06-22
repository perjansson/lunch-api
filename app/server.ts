import express, { Application } from 'express'
import { app } from './app'

// TODO: Use port from environment variables
const port = 3000

app.listen(port, () => {
  console.log(`Starting lunch-api on port: ${port}`)
})
