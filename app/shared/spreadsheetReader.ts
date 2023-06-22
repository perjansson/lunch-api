import { google } from 'googleapis'
import { SPREADSHEET_ID } from './constants'

const sheets = google.sheets('v4')
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

async function getAuthToken() {
  // TODO: Configure key (service_account_credentials.json) for all environments
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
  })

  return auth
}

export async function getSpreadSheetValues(sheetName: string) {
  const auth = await getAuthToken()

  return sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    auth,
    range: sheetName,
  })
}
