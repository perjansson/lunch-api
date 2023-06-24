import express, { Application } from 'express'
import { app } from './app'

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Starting lunch-api on port: ${port}`)
})
