module.exports = {
    lastRowNumber: function(sheet) {
        let rows = Object.keys(sheet).filter((x) => x.startsWith('A') && x.charAt(1) !== 'F')
        let lastRow = rows[rows.length - 1]
        return String(Number(lastRow.replace('A', '')))
    },

    readFromRow: function(sheet, row) {
        return {
            policy: sheet['A' + row] !== undefined ? sheet['A' + row].v : '',
            name: sheet['B' + row] !== undefined ? sheet['B' + row].v : '',
            sum: sheet['C' + row] !== undefined ? sheet['C' + row].v : '',
            branch: sheet['D' + row] !== undefined ? sheet['D' + row].v : '',
            error: sheet['E' + row] !== undefined ? sheet['E' + row].v : '',
            a: sheet['F' + row] !== undefined ? sheet['F' + row].v : '',
            b: sheet['G' + row] !== undefined ? sheet['G' + row].v : '',
            c: sheet['H' + row] !== undefined ? sheet['H' + row].v : '',
        }
    },

    readFromCell: function(sheet, column, row) {
        return sheet[column + row] !== undefined ? sheet[column + row].v : ''
    },

    addNewValue: function(sheet, column, value) { 
        let XLSX = require('xlsx')
        let rows = Object.keys(sheet).filter((x) => x.startsWith(column) && x.charAt(1) !== 'F')
        let lastRow = rows[rows.length - 1]
        let newRow = column + String(Number(lastRow.replace(column, '')) + 1)
        XLSX.utils.sheet_add_aoa(sheet, [[value]], { origin: newRow })
        log.info(`Added New Value: "${value}" to -> ${newRow}`)
    },

    addNewRow: function(sheet, company, price, scale) {
        let utils = require('./utils.js')
        utils.addNewValue(sheet, 'A', company)
        utils.addNewValue(sheet, 'B', price)
        utils.addNewValue(sheet, 'C', scale)
    },

    writeResultsFile: (data, workbook, resultsFilePath) => {
        let XLSX = require('xlsx')
        let resultsWorksheet = XLSX.utils.aoa_to_sheet(data)
        XLSX.utils.book_append_sheet(workbook, resultsWorksheet, 'תוצאות')
        XLSX.writeFile(workbook, resultsFilePath)
    },

    randomNumber: (min, max) => { 
        return Math.floor(Math.random() * (max - min + 1) + min)
    },

    currentDateTime: function() {
        let today = new Date()
        let	day = String(today.getDate()).padStart(2, "0")
        let	month = String(today.getMonth() + 1).padStart(2, "0")
        let	year = today.getFullYear()
        let	hours = today.getHours()
        let	minutes = today.getMinutes()
        return `${day}-${month}-${year}`
    },

    log: (type, message) => {
        if (type == 'info') log.info(`(ℹ️) ${message}`)
        if (type == 'error') log.info(`❌ ${message}`)
        if (type == 'warning') log.info(`⚠️ ${message}`)
        if (type == 'success') log.info(`✔️ ${message}`)
    },
}