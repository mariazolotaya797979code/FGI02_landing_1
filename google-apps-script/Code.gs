/**
 * AERIS — приём заявок с лендинга в Google Таблицу
 * Аккаунт: maria.zolotaya79@gmail.com
 */

var SPREADSHEET_ID = '1Atb_eTp1F5dQUOn2qCv3eytp0CxUI_cCrLSUYDWMdFQ';
var SHEET_NAME = 'Заявки';
var HEADERS = ['Дата', 'Имя', 'Телефон / Telegram', 'Задача', 'Источник'];

function doPost(e) {
  try {
    var data = parsePayload_(e);
    appendLead_(data);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  if (e && e.parameter && (e.parameter.name || e.parameter.contact)) {
    return doPost(e);
  }
  return json_({ ok: true, service: 'AERIS leads' });
}

function parsePayload_(e) {
  var data = {};
  if (e && e.postData && e.postData.contents) {
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      data = e.parameter || {};
    }
  } else if (e && e.parameter) {
    data = e.parameter;
  }
  return {
    name: String(data.name || '').trim(),
    contact: String(data.contact || '').trim(),
    task: String(data.task || '').trim(),
    source: String(data.source || 'Лендинг AERIS').trim()
  };
}

function getSpreadsheet_() {
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (err) {}
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function appendLead_(data) {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#1C1C1E')
      .setFontColor('#A8E6CF');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(2, 180);
    sheet.setColumnWidth(3, 220);
    sheet.setColumnWidth(4, 420);
    sheet.setColumnWidth(5, 180);
  }
  sheet.getRange(1, 3, sheet.getMaxRows(), 1).setNumberFormat('@');
  sheet.appendRow([
    new Date(),
    asText_(data.name),
    asText_(data.contact),
    asText_(data.task),
    asText_(data.source)
  ]);
}

function asText_(value) {
  var s = String(value == null ? '' : value);
  if (/^[=+\-@]/.test(s)) return "'" + s;
  return s;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
