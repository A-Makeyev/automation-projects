// Install WinAppDriver.exe
// Enable Developer Mode
// Launch Appium Server

const utils = require('./utils.js')
const app = 'ALDI FOTO.exe'

win.transaction(`Open ${app}`)
utils.openApp(app)

win.transaction('Close Updates Popup')
win.isVisible('name=Maybe Later', utils.longWait) && win.click('name=Maybe Later')

win.transaction('Open Photobooks')
win.click('(//Pane[@ClassName="RB_CanvasPane"])[8]') // photobooks
win.click('(//Pane[@ClassName="RB_CanvasPane"])[5]') // simple photobooks collection
win.click('(//Pane[@ClassName="RB_CanvasPane"])[46]') // hardcover digital portrait
win.click('(//Pane[@ClassName="RB_CanvasPane"])[21]') // create now
win.click('(//Pane[@ClassName="RB_CanvasPane"])[4]') // straight to editor // [24] on smaller pcs?
win.click('name=Continue')
win.pause(utils.longWait)

win.transaction('Upload Images Folder')
log.info(win.getWindowHandles())
win.selectWindow(win.getWindowHandles()[0])
// win.selectWindow(`title=Project 'Untitled ${utils.getCurrentDate()} 12.28.30' (Fotobuch Hardcover groß)`)

win.click('(//Pane[@ClassName="RB_CanvasPane"])[1]')
win.click('(//Pane[@ClassName="RB_CanvasPane"])[2]')

win.pause(utils.shortWait)
utils.closeApp(app)
