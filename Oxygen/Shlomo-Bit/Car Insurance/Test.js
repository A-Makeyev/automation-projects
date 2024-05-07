// npm i -g xlsx
// install location -> %appdata%\npm\node_modules
// run settings -> Enable “npm -g root” execution
// more info -> https://www.npmjs.com/package/xlsx

web.transaction('Initialize Data')
const utils = require('./utils.js')
const fs = require('fs')
const XLSX = require('xlsx')
const path = require('path')
const dataFolder = path.join(__dirname, './Data')
const original_xlsxFilePath =  dataFolder + '\\תקבולים.xlsx'
const copy_xlsxFilePath = dataFolder + '\\תקבולים - Copy.xlsx'

if (!fs.existsSync(copy_xlsxFilePath)) {
    fs.copyFileSync(original_xlsxFilePath, copy_xlsxFilePath)
    !fs.existsSync(copy_xlsxFilePath) && fs.appendFileSync(copy_xlsxFilePath)
        
    fs.existsSync(copy_xlsxFilePath) 
        ? log.info(`Created a copy of the original xlsx -> ${copy_xlsxFilePath}`)
        : assert.fail(`Failed to create a copy of the original xlsx -> ${copy_xlsxFilePath}`)
}

const xlsxFilePath = copy_xlsxFilePath
const workbook = XLSX.readFile(xlsxFilePath)
const sheet = workbook.Sheets.sheet_1

web.transaction('Read Values')
var lastRow = utils.lastRowNumber(sheet)
log.info(utils.readFromRow(sheet, lastRow))

web.transaction('Assign New Values')
utils.addNewRow(sheet, '11111111', 'משה כהן', '2222', '120')

web.transaction('Update XLSX')
XLSX.writeFileXLSX(workbook, xlsxFilePath)

// web.transaction('Attach XSLX File')
// ox.addAttachment(copy_xlsxFilePath)

// web.transaction('Delete Copy of XSLX File')
// fs.unlinkSync(copy_xlsxFilePath)
