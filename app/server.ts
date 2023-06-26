import { app } from './app'

validateRequiredEnvironmentVariables()

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`Starting lunch-api on port: ${port}`)
})

function validateRequiredEnvironmentVariables() {
  const requiredVariables = ['API_KEYS', 'GOOGLE_APPLICATION_CREDENTIALS']

  for (const variable of requiredVariables) {
    if (!process.env[variable] || process.env[variable] === 'undefined') {
      console.error(
        `${variable} environment variable is not set. The application cannot start correctly.`
      )
      process.exit(1)
    }
  }
}
