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

    addNewValue: function(sheet, column, value) { 
        let XLSX = require('xlsx')
        let rows = Object.keys(sheet).filter((x) => x.startsWith(column) && x.charAt(1) !== 'F')
        let lastRow = rows[rows.length - 1]
        let newRow = column + String(Number(lastRow.replace(column, '')) + 1)
        XLSX.utils.sheet_add_aoa(sheet, [[value]], { origin: newRow })
        log.info(`Added New Value: "${value}" to -> ${newRow}`)
    },

    addNewRow: function(sheet, policy, name, sum, branch, error) {
        let utils = require('./utils.js')
        utils.addNewValue(sheet, 'A', policy)
        utils.addNewValue(sheet, 'B', name)
        utils.addNewValue(sheet, 'C', sum)
        utils.addNewValue(sheet, 'D', branch)
        utils.addNewValue(sheet, 'E', error)
        utils.addNewValue(sheet, 'F', '')
        utils.addNewValue(sheet, 'G', '')
        utils.addNewValue(sheet, 'H', '')
    },
}