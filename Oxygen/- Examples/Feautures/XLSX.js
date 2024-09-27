// https://www.npmjs.com/package/xlsx
// set inside -> %appdata%\npm

function currentDateTime() {
    let today = new Date()
    let	day = String(today.getDate()).padStart(2, "0")
    let	month = String(today.getMonth() + 1).padStart(2, "0")
    let	year = today.getFullYear()
    return `${day}-${month}-${year}`
}

var file = 'Example Data.xlsx'
var XLSX = require('xlsx')
var path = require('path')
var dataFolder = path.join(__dirname, './Data')
var resultsFolder = path.join(__dirname, './Results')
var xlsxFilePath =  dataFolder + '\\' + file 
var resultFilePath = resultsFolder + `\\Result ~ ${currentDateTime()} ~ ID_${Math.floor(Math.random() * (99999 - 66666 + 1) + 66666)}.xlsx`

var workbook = XLSX.readFile(xlsxFilePath)
var sheetName = workbook.SheetNames[0]
var worksheet = workbook.Sheets[sheetName]
var data = XLSX.utils.sheet_to_json(worksheet)
var resultsWorkbook = XLSX.utils.book_new()
var ws_data = []

try {
    for (let x = 0; x < data.length; x++) {
        var anaf = data[x].Anaf
        var polica = data[x].Polica
        var tosefet = data[x].Tosefet

        var passed = true

        ws_data.push({
            Anaf: anaf, 
            Polica: polica, 
            Tosefet: tosefet, 
            Status: passed ? 'Passed' : 'Failed' 
        })
    }

    log.info(ws_data)

    let resultsWorksheet = XLSX.utils.json_to_sheet(ws_data)
    XLSX.utils.book_append_sheet(resultsWorkbook, resultsWorksheet, 'Results')
    XLSX.writeFile(resultsWorkbook, resultFilePath)
} catch(error) {
    let resultsWorksheet = XLSX.utils.json_to_sheet(ws_data)
    XLSX.utils.book_append_sheet(resultsWorkbook, resultsWorksheet, 'Results')
    XLSX.writeFile(resultsWorkbook, resultFilePath)
}
