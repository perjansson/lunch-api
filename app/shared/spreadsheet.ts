import { google, sheets_v4 } from 'googleapis'
import { SPREADSHEET_ID } from './constants'
import { GOOGLE_APPLICATION_CREDENTIALS } from './environment'

const sheets = google.sheets('v4')
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

async function getAuthToken() {
  const auth = new google.auth.GoogleAuth({
    credentials: GOOGLE_APPLICATION_CREDENTIALS,
    scopes: SCOPES,
  })

  return auth
}

export async function getSpreadSheetValues(
  sheetName: string
): Promise<sheets_v4.Schema$ValueRange | undefined> {
  try {
    const auth = await getAuthToken()

    return (
      await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: sheetName,
        auth,
      })
    ).data
  } catch (error) {
    const errorMessage = `Error getting spreadsheet values at range ${sheetName}:`
    console.error(errorMessage, error instanceof Error ? error.message : error)
    throw Error(errorMessage)
  }
}

export async function updateSpreadSheetValues(
  sheetName: string,
  values: string[][]
): Promise<void> {
  try {
    const auth = await getAuthToken()

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
      auth,
    })
  } catch (error) {
    const errorMessage = `Error updating spreadsheet values at range ${sheetName}:`
    console.error(errorMessage, error instanceof Error ? error.message : error)
    throw Error(errorMessage)
  }
}
