import express, { Application } from 'express'
import { app } from './app'

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`Starting lunch-api on port: ${port}`)
})
