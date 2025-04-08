const SPREADSHEET_ID = "1d2wK_Q790uD5awe4OlQpXS8yn4IfWrRLA8LHLUCjLSc";
const DATA_RANGE = "MASTER_DATA!A1:H";
const FILTER_CONFIG = [
  { id: 'processo', header: 'PROCESSO' },
  { id: 'tipo', header: 'TIPO_CONCORRENCIA' },
  { id: 'curso', header: 'CURSO' }
];

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getFilters() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const data = sheet.getRange(DATA_RANGE).getValues();
  const headers = data[0].map(h => h.toString().trim().toUpperCase());
  return FILTER_CONFIG.reduce((acc, { id, header }) => {
    const idx = headers.indexOf(header);
    acc[id] = idx !== -1 ? getUniqueValues(data, idx) : [];
    return acc;
  }, {});
}

function getFilteredData(filters) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const data = sheet.getRange(DATA_RANGE).getValues();
  const headers = data[0].map(h => h.toString().trim().toUpperCase());
  return data.slice(1)
    .filter(row =>
      FILTER_CONFIG.every(({ id, header }) => {
        const idx = headers.indexOf(header);
        return idx !== -1 && row[idx].toString().trim() === filters[id];
      })
    )
    .map(row =>
      headers.reduce((obj, h, i) => {
        obj[h] = row[i].toString();
        return obj;
      }, {})
    );
}

const getUniqueValues = (data, idx) =>
  [...new Set(data.slice(1).map(r => r[idx].toString().trim()))].filter(Boolean);

function include(fileName) {
  return HtmlService.createHtmlOutputFromFile(fileName).getContent();
}
