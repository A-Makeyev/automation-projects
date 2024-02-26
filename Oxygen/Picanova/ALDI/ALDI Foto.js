// Install WinAppDriver.exe
// Enable Developer Mode
// Launch Appium Server

win.init({
    "app": "C:\\Program Files (x86)\\ALDI Foto\\ALDI Foto.exe",
    "platformName": "Windows",
    "deviceName": "WindowsPC"
})

const program = 'ALDI FOTO.exe'
const { execSync } = require('child_process')

win.isVisible('name=Maybe Later', 5000) && win.click('name=Maybe Later')

const proc = execSync(`wmic process where "name='${program}'" delete`)
log.info(proc.toString().replace('\r\n', ` Closed ${program}`))



win.pause(3000)
