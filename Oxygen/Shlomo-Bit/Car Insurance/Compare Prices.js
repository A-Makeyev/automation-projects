// https://ioflood.com/blog/npm-xlsx

web.transaction('Initialize Data')
var debug = false
var file = 'השוואת פרופילי ביטוח פרטי - אתר משרד האוצר.xlsx'
var fileCopy = file.split('.')[0] + ' - Copy.' + file.split('.')[1]
var utils = require('./utils.js')
var shortWait = 5555
var fs = require('fs')
var XLSX = require('xlsx')
var path = require('path')
var dataFolder = path.join(__dirname, './Data')
var resultsFolder = path.join(__dirname, './Results')
var xlsxFilePath =  dataFolder + '\\' + file 
var copy_xlsxFilePath = dataFolder + '\\' + fileCopy
var workbook = XLSX.readFile(xlsxFilePath)
var sheet = workbook.Sheets.Everything

var result = resultsFolder + `\\Result ~ ${utils.currentDateTime()} ~ ID_${utils.randomNumber(66666, 99999)}`
var resultsFilePath = result + `\\Prices ~ ${utils.currentDateTime()}.xlsx`
if (!fs.existsSync(result)) fs.mkdirSync(result)

web.transaction('Create A Copy Of The Data File')
if (!fs.existsSync(copy_xlsxFilePath)) {
    fs.copyFileSync(xlsxFilePath, copy_xlsxFilePath)
    !fs.existsSync(copy_xlsxFilePath) && fs.appendFileSync(copy_xlsxFilePath)
        
    fs.existsSync(copy_xlsxFilePath) 
        ? log.info(`Created a copy of the original xlsx -> ${copy_xlsxFilePath}`)
        : assert.fail(`Failed to create a copy of the original xlsx -> ${copy_xlsxFilePath}`)
}

web.transaction('Create New Results File')
var resultsWorkbook = XLSX.utils.book_new()
var lastRow = utils.lastRowNumber(sheet)
var startRow = 2
var companiesWritten = false
var companies = []
var ws_data = []

web.transaction('Open car.cma.gov.il')
web.init()
web.open('https://car.cma.gov.il')

if (web.isVisible('//div[@id="pagecontainer"]', shortWait) && debug) web.click('//input[@type="submit"]')
if (web.isVisible('//div[@class="m_txtErr"]', shortWait) && debug) assert.fail(web.getText('//div[@class="m_txtErr"]'))

var windowWidth = web.execute(() => { return window.innerWidth })
var windowHeight = web.execute(() => { return window.innerHeight })
windowWidth > 1920 && web.setWindowSize(1700, windowHeight)

try {
    for (let row = startRow; row <= lastRow; row++) {
        var prices = []
        var displayData = []

        web.transaction(`Read Values ~ Row ${row}`)
        // var usage = utils.readFromCell(sheet, 'L', row)
        // var carType = utils.readFromCell(sheet, 'B', row) === 'פרטי' ? 'רכב פרטי' : utils.readFromCell(sheet, 'B', row)
        var ownership = utils.readFromCell(sheet, 'K', row) === 'בעלות פרטית' ? 'בעלות פרטית' : 'בעלות אחרת'
        var gender = utils.readFromCell(sheet, 'C', row) === 'גבר' ? '1' : '2'
        var age = utils.readFromCell(sheet, 'D', row)
        var seniority = utils.readFromCell(sheet, 'E', row)
        var engineCapacity = utils.readFromCell(sheet, 'A', row)
        var ABS = utils.readFromCell(sheet, 'I', row) == 'קיימת' ? '1' : utils.readFromCell(sheet, 'I', row) == 'לא קיימת' ? '2' : ''
        var ESP = utils.readFromCell(sheet, 'F', row) == 'קיימת' ? '1' : utils.readFromCell(sheet, 'F', row) == 'לא קיימת' ? '2' : ''
        var FCW = utils.readFromCell(sheet, 'G', row) == 'קיימת' ? '1' : utils.readFromCell(sheet, 'G', row) == 'לא קיימת' ? '2' : ''
        var LDW = utils.readFromCell(sheet, 'H', row) == 'קיימת' ? '1' : utils.readFromCell(sheet, 'H', row) == 'לא קיימת' ? '2' : ''
        var fuel = utils.readFromCell(sheet, 'B', row)
        var insuranceDate = utils.readFromCell(sheet, 'J', row) // .toString().split('.').join('/')

        if (web.isVisible('//div[@id="pagecontainer"]', shortWait) && debug) web.click('//input[@type="submit"]')
        
        web.transaction(`Enter Details ~ Row ${row}`)
        // web.select('id=ddlSheets', `label=${carType}`)
        // web.select('id=B', `label=${usage}`)

        web.select('id=code_owner', `label=${ownership}`)
        web.type('id=insurance_date', insuranceDate)
        web.click(`//label[text()="מין הנהג"]//..//..//input[@value="${gender}"]`)
        web.type('//input[@placeholder="הקלד גיל"]', age)
        web.type('//input[@placeholder="הקלד ותק"]', seniority)
        web.type('//input[contains(@placeholder, "הקלד מספר תאונות")]', '0')
        web.type('//input[contains(@placeholder, "הקלד מספר הרשעות")]', '0')
        web.select('id=N', `label=${fuel}`)
    
        if (engineCapacity != '0') web.type('//input[contains(@placeholder, "הקלד נפח מנוע")]', engineCapacity)
        
        web.type('//input[contains(@placeholder, "הקלד כוחות סוס")]', '100')
        web.click(`//label[text()="מערכת למניעת נעילת גלגלים (ABS)"]//..//..//input[@value="${ABS}"]`)
        web.click(`//label[text()="מערכת לבקרת יציבות (ESP)"]//..//..//input[@value="${ESP}"]`)
        web.type('//label[text()="מספר כריות אויר ברכב"]//..//..//input[@type="text"]', '4')
        web.click(`//label[text()="מערכת התרעה על אי שמירת מרחק (FCW)"]//..//..//input[@value="${FCW}"]`)
        web.click(`//label[text()="מערכת התרעה על סטיה מנתיב (LDW)"]//..//..//input[@value="${LDW}"]`)
        
        web.transaction('Compare')
        web.click('id=press_to_compare')

        if (web.isVisible('//div[@id="pagecontainer"]', shortWait) && debug) web.click('//input[@type="submit"]')
        
        web.transaction(`Collect Results ~ Row ${row}`)
        var companyElements = '//td[contains(@class, "ColCompany")]'
        var dataElements = '//..//td[contains(@class, "alignCenter")]'
        var results = web.getElementCount(companyElements)

        web.scrollToElement(`(${companyElements})[${results - 1}]`, true)
        web.click('//th[@title="לחיצה על הכותרת תמיין את הנתונים בעמודה" and contains(text(), "חברת הביטוח")]')
        web.pause(shortWait / 2)

        web.transaction(`Write Results ~ Row ${row}`)
        if (!companiesWritten) {
            for (let x = 1; x <= results; x++) {
                let company = web.isVisible(`(${companyElements})[${x}]`) ? web.getText(`(${companyElements})[${x}]`) : ''
                companies.push(company) 
            }

            companies.push('', '', 'בעלות', 'תאריך ת. ביטוח', 'ABS', 'LDW', 'FCW', 'ESP', 'ותק', 'גיל', 'מין', 'דלק', 'נפח מנוע')
            ws_data.push(companies)
            companiesWritten = true
        }

        for (let x = 1; x <= results; x++) {
            let company = web.isVisible(`(${companyElements})[${x}]`) ? web.getText(`(${companyElements})[${x}]`) : ''
            let price = web.isVisible(`(${companyElements})[${x}]${dataElements}[1]`) ? web.getText(`(${companyElements})[${x}]${dataElements}[1]`) : ''
            let scale = web.isVisible(`(${companyElements})[${x}]${dataElements}[2]`) ? web.getText(`(${companyElements})[${x}]${dataElements}[2]`) : ''

            price = price.replace('*', '').trim() + '₪'
            displayData.push(`Company: ${company} Price: ${price} Scale: ${scale}`)
            prices.push(price)
        }

        gender = gender == '1' ? 'גבר' : 'אישה'
        ABS = ABS == '1' ? 'קיימת' : ABS == '2' ? 'לא קיימת' : ''
        LDW = LDW == '1' ? 'קיימת' : LDW == '2' ? 'לא קיימת' : ''
        FCW = FCW == '1' ? 'קיימת' : FCW == '2' ? 'לא קיימת' : ''
        ESP = ESP == '1' ? 'קיימת' : ESP == '2' ? 'לא קיימת' : ''

        prices.push('', '', ownership, insuranceDate, ABS, LDW, FCW, ESP, seniority, age, gender, fuel, engineCapacity)
        ws_data.push(prices) 

        utils.log('success', `Row ${row} Results:`)
        for (let x = 0; x < displayData.length; x++) {
            utils.log('info', displayData[x])
        }
        
        if (web.isVisible('//div[@id="pagecontainer"]', shortWait) && debug) web.click('//input[@type="submit"]')

        var ss = web.takeScreenshot()
        var screenshotFile = result + `\\Row - ${row}.jpg`
        fs.writeFileSync(screenshotFile, ss, 'base64')

        web.click('id=butt-1-reCalc')
    }
} catch(error) {
    utils.writeResultsFile(ws_data, resultsWorkbook, resultsFilePath)
}

if (!fs.existsSync(resultsFilePath)) {
    utils.writeResultsFile(ws_data, resultsWorkbook, resultsFilePath)
}
