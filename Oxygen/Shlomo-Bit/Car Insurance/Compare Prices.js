web.transaction('Open car.cma.gov.il')
web.init()
web.open('https://car.cma.gov.il')

const windowWidth = web.execute(() => { return window.innerWidth })
const windowHeight = web.execute(() => { return window.innerHeight })
windowWidth > 1920 && web.setWindowSize(1700, windowHeight)

// web.transaction('Initialize Data')
// const utils = require('./utils.js')
// const fs = require('fs')
// const XLSX = require('xlsx')
// const path = require('path')
// const dataFolder = path.join(__dirname, './Data')
// const xlsxFilePath =  dataFolder + '\\חובה - אתר משרד האוצר.xlsx'
// const resultFilePath = dataFolder + '\\result.xlsx'
// const workbook = XLSX.readFile(xlsxFilePath)
// const sheet = workbook.Sheets.sheet_1

// web.transaction('Read Values')
// var lastRow = utils.lastRowNumber(sheet)
// log.info(utils.readFromRow(sheet, lastRow))

// web.transaction('Assign New Values')
// utils.addNewRow(sheet, '11111111', 'משה כהן', '2222', '120')

// web.transaction('Update XLSX')
// XLSX.writeFileXLSX(workbook, resultFilePath)

web.transaction('Enter Details')
web.select('id=ddlSheets', 'value=1')
web.select('id=code_owner', 'value=1001')
web.type('id=insurance_date', '01/04/2024')
web.click('//label[text()="מין הנהג"]//..//..//input[@value="1"]')
web.type('//input[@placeholder="הקלד גיל"]', '20')
web.type('//input[@placeholder="הקלד ותק"]', '1')
web.type('//input[contains(@placeholder, "הקלד מספר תאונות")]', '1')
web.type('//input[contains(@placeholder, "הקלד מספר הרשעות")]', '1')
web.select('id=N', 'value=1')
web.type('//input[contains(@placeholder, "הקלד נפח מנוע")]', '1')
web.type('//input[contains(@placeholder, "הקלד כוחות סוס")]', '1')
web.click('//label[text()="מערכת למניעת נעילת גלגלים (ABS)"]//..//..//label[text()="קיימת"]')
web.click('//label[text()="מערכת לבקרת יציבות (ESP)"]//..//..//label[text()="לא קיימת"] ')
web.type('//label[text()="מספר כריות אויר ברכב"]//..//..//input[@type="text"]', '4')
web.click('//label[text()="מערכת התרעה על אי שמירת מרחק (FCW)"]//..//..//label[text()="קיימת"]')
web.click('//label[text()="מערכת התרעה על סטיה מנתיב (LDW)"]//..//..//label[text()="לא קיימת"] ')
web.select('id=B', 'value=6')
web.click('id=press_to_compare')

web.transaction('Collect Results')
const companyElements = '//td[contains(@class, "ColCompany")]'
const priceElements = `${companyElements}//..//td[@class="alignCenter" and contains(text(), ",") or contains(text(), "*") or contains(text(), "החברה אינה מוכרת ביטוח לפרופיל זה")]`
const scaleElements = `${companyElements}//..//td[@class="alignCenter" and not(contains(text(), ",") or contains(text(), "*"))]`
const results = web.getElementCount(companyElements)

for (let x = 1; x <= results; x++) {
    let compny = web.getText(`(${companyElements})[${x}]`)
    let price = web.getText(`(${priceElements})[${x}]`)
    let scale = web.getText(`(${scaleElements})[${x}]`)
    let result = `Company: ${compny} Price: ${price} Scale: ${scale}`
    log.info(result)
}
