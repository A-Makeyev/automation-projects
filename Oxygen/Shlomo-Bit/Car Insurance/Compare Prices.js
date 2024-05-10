web.transaction('Initialize Data')
const utils = require('./utils.js')
const fs = require('fs')
const XLSX = require('xlsx')
const path = require('path')
const dataFolder = path.join(__dirname, './Data')
const resultsFolder = path.join(__dirname, './Results')
const xlsxFilePath =  dataFolder + '\\חובה - אתר משרד האוצר.xlsx'
const copy_xlsxFilePath = dataFolder + '\\חובה - אתר משרד האוצר - Copy.xlsx'
const resultsFilePath = resultsFolder + `\\results ~ ${utils.currentDateTime()}.xlsx`
const workbook = XLSX.readFile(xlsxFilePath)
const sheet = workbook.Sheets.sheet_1

web.transaction('Create A Copy Of The Data File')
if (!fs.existsSync(copy_xlsxFilePath)) {
    fs.copyFileSync(xlsxFilePath, copy_xlsxFilePath)
    !fs.existsSync(copy_xlsxFilePath) && fs.appendFileSync(copy_xlsxFilePath)
        
    fs.existsSync(copy_xlsxFilePath) 
        ? log.info(`Created a copy of the original xlsx -> ${copy_xlsxFilePath}`)
        : assert.fail(`Failed to create a copy of the original xlsx -> ${copy_xlsxFilePath}`)
}

web.transaction('Create New Results File')
fs.appendFileSync(resultsFilePath)

web.transaction('Open car.cma.gov.il')
web.init()
web.open('https://car.cma.gov.il')

const windowWidth = web.execute(() => { return window.innerWidth })
const windowHeight = web.execute(() => { return window.innerHeight })
windowWidth > 1920 && web.setWindowSize(1700, windowHeight)

const data = []
const wb = XLSX.utils.book_new()
const startRow = 39
const lastRow = 50

for (let profile = 1, row = startRow; row !== lastRow; row++, profile++) {
    web.transaction(`Read Values ~ Row ${row}`)
    const carType = utils.readFromCell(sheet, 'B', row) === 'פרטי' ? 'רכב פרטי' : utils.readFromCell(sheet, 'B', row)
    const ownership = utils.readFromCell(sheet, 'C', row) === 'פרטית' ? 'בעלות פרטית' : 'בעלות אחרת'
    const gender = utils.readFromCell(sheet, 'D', row) === 'גבר' ? '1' : '2'
    const age = utils.readFromCell(sheet, 'E', row)
    const seniority = utils.readFromCell(sheet, 'F', row)
    const engineCapacity = utils.readFromCell(sheet, 'G', row)
    const ABS = utils.readFromCell(sheet, 'H', row) === 'יש' ? 'קיימת' : 'לא קיימת'
    const ESP = utils.readFromCell(sheet, 'I', row) === 'יש' ? 'קיימת' : 'לא קיימת'
    const FCW = utils.readFromCell(sheet, 'J', row) === 'יש' ? 'קיימת' : 'לא קיימת'
    const LDW = utils.readFromCell(sheet, 'K', row) === 'יש' ? 'קיימת' : 'לא קיימת'
    const usage = utils.readFromCell(sheet, 'L', row)
    const fuel = utils.readFromCell(sheet, 'M', row)
    const insuranceDate = utils.readFromCell(sheet, 'N', row).split('.').join('/')

    web.transaction(`Enter Details ~ Row ${row}`)
    web.select('id=ddlSheets', `label=${carType}`)
    web.select('id=code_owner', `label=${ownership}`)
    web.type('id=insurance_date', insuranceDate)
    web.click(`//label[text()="מין הנהג"]//..//..//input[@value="${gender}"]`)
    web.type('//input[@placeholder="הקלד גיל"]', age)
    web.type('//input[@placeholder="הקלד ותק"]', seniority)
    web.type('//input[contains(@placeholder, "הקלד מספר תאונות")]', '0')
    web.type('//input[contains(@placeholder, "הקלד מספר הרשעות")]', '0')
    web.select('id=N', `label=${fuel}`)
    web.type('//input[contains(@placeholder, "הקלד נפח מנוע")]', engineCapacity)
    web.type('//input[contains(@placeholder, "הקלד כוחות סוס")]', '100')
    web.click(`//label[text()="מערכת למניעת נעילת גלגלים (ABS)"]//..//..//label[text()="${ABS}"]`)
    web.click(`//label[text()="מערכת לבקרת יציבות (ESP)"]//..//..//label[text()="${ESP}"]`)
    web.type('//label[text()="מספר כריות אויר ברכב"]//..//..//input[@type="text"]', '4')
    web.click(`//label[text()="מערכת התרעה על אי שמירת מרחק (FCW)"]//..//..//label[text()="${FCW}"]`)
    web.click(`//label[text()="מערכת התרעה על סטיה מנתיב (LDW)"]//..//..//label[text()="${LDW}"]`)
    web.select('id=B', `label=${usage}`)
    web.click('id=press_to_compare')

    web.transaction(`Collect Results ~ Row ${row}`)
    const companyElements = '//td[contains(@class, "ColCompany")]'
    const priceElements = `${companyElements}//..//td[@class="alignCenter" and contains(text(), ",") or contains(text(), "*") or contains(text(), "החברה אינה מוכרת ביטוח לפרופיל זה")]`
    const scaleElements = `${companyElements}//..//td[@class="alignCenter" and not(contains(text(), ",") or contains(text(), "*"))]`
    const results = web.getElementCount(companyElements)

    web.transaction(`Write Results ~ Row ${row}`)
    for (let x = 1; x <= results; x++) {
        let company = web.getText(`(${companyElements})[${x}]`)
        let price = web.getText(`(${priceElements})[${x}]`)
        let scale = web.getText(`(${scaleElements})[${x}]`)
        data.push({ 
            company: company,
            price: price,
            scale: scale 
        })
        utils.log('success',`Added row: Company: ${company} Price: ${price} Scale: ${scale}`)
    }
    
    const ws = XLSX.utils.json_to_sheet(data) 
    XLSX.utils.book_append_sheet(wb, ws, `Profile ${profile}`)

    // clear data 
    data.length = 0
    web.click('id=butt-1-reCalc')
}

XLSX.writeFile(wb, resultsFilePath)

// web.transaction('Attach XSLX File')
// ox.addAttachment(copy_xlsxFilePath)

// web.transaction('Delete Copy of XSLX File')
// fs.unlinkSync(copy_xlsxFilePath)
