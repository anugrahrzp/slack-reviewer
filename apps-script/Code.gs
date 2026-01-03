/**
 * GOOGLE APPS SCRIPT - Slack Mentions Web App
 *
 * SETUP:
 * 1. Open Google Sheets with your Slack data
 * 2. Extensions > Apps Script
 * 3. Delete any existing code
 * 4. Create two files: Code.gs (this file) and index.html
 * 5. Deploy > New deployment > Web app
 *    - Execute as: Me
 *    - Who has access: Anyone within Razorpay
 */

// ===== CONFIGURATION =====
const CONFIG = {
  SHEET_NAME: 'Slack Todo',
  COLUMNS: {
    TIMESTAMP: 0,      // A
    CHANNEL: 1,        // B
    SENDER: 2,         // C
    MESSAGE: 3,        // D
    LINK: 4,           // E
    PRIORITY: 5,       // F
    CONTEXT: 6,        // G
    REPLIED: 7,        // H
    YOUR_REPLY: 8,     // I
    SUGGESTED_REPLY: 9 // J
  },
  HEADER_ROW: 1
};

/**
 * Serve the web app - returns HTML page
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Slack Mention Reviewer')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Get all mentions from the sheet
 * Called from frontend via google.script.run
 */
function getMentions() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);

    if (!sheet) {
      return { error: 'Sheet "' + CONFIG.SHEET_NAME + '" not found' };
    }

    const data = sheet.getDataRange().getValues();
    const mentions = [];

    for (let i = CONFIG.HEADER_ROW; i < data.length; i++) {
      const row = data[i];

      // Skip empty rows
      if (!row[CONFIG.COLUMNS.CHANNEL] && !row[CONFIG.COLUMNS.SENDER] && !row[CONFIG.COLUMNS.MESSAGE]) {
        continue;
      }

      const mention = {
        id: i + 1, // Row number (1-indexed)
        timestamp: row[CONFIG.COLUMNS.TIMESTAMP] ? new Date(row[CONFIG.COLUMNS.TIMESTAMP]).toISOString() : null,
        channel: row[CONFIG.COLUMNS.CHANNEL] || '',
        sender: row[CONFIG.COLUMNS.SENDER] || '',
        message: row[CONFIG.COLUMNS.MESSAGE] || '',
        link: row[CONFIG.COLUMNS.LINK] || '',
        priority: row[CONFIG.COLUMNS.PRIORITY] || 'P2',
        context: row[CONFIG.COLUMNS.CONTEXT] || '',
        replied: row[CONFIG.COLUMNS.REPLIED] === true || row[CONFIG.COLUMNS.REPLIED] === 'TRUE' || row[CONFIG.COLUMNS.REPLIED] === 'true',
        yourReply: row[CONFIG.COLUMNS.YOUR_REPLY] || '',
        suggestedReply: row[CONFIG.COLUMNS.SUGGESTED_REPLY] || ''
      };

      mentions.push(mention);
    }

    return {
      success: true,
      mentions: mentions,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    return { error: error.toString() };
  }
}

/**
 * Mark a mention as replied
 */
function markReplied(rowId, reply) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);

    if (!sheet) {
      return { error: 'Sheet not found' };
    }

    // Set REPLIED column to TRUE
    sheet.getRange(rowId, CONFIG.COLUMNS.REPLIED + 1).setValue(true);

    // Save the reply if provided
    if (reply) {
      sheet.getRange(rowId, CONFIG.COLUMNS.YOUR_REPLY + 1).setValue(reply);
    }

    return { success: true };

  } catch (error) {
    return { error: error.toString() };
  }
}

/**
 * Save a suggested reply
 */
function saveSuggestedReply(rowId, suggestedReply) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);

    if (!sheet) {
      return { error: 'Sheet not found' };
    }

    sheet.getRange(rowId, CONFIG.COLUMNS.SUGGESTED_REPLY + 1).setValue(suggestedReply);

    return { success: true };

  } catch (error) {
    return { error: error.toString() };
  }
}
