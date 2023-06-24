import { google, sheets_v4 } from 'googleapis'
import { GaxiosResponse } from 'gaxios'
import { SPREADSHEET_ID } from './constants'

const sheets = google.sheets('v4')
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

async function getAuthToken() {
  const auth = new google.auth.GoogleAuth({
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
        auth,
        range: sheetName,
      })
    ).data
  } catch (error) {
    console.error(
      `Error getting spreadsheet values at range ${sheetName}:`,
      error instanceof Error ? error.message : error
    )

    return undefined
  }
}
