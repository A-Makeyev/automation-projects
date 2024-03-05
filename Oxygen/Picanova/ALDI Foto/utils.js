module.exports = {
    shortWait: 5000,
    longWait: 10000,

    openApp: (app) => {
        let utils = require('./utils.js')
        if (utils.isAppRunning(app)) {
            log.info(`${app} is already running..`)
            utils.closeApp(app)
        }

        win.init({
            "app": "C:\\Program Files (x86)\\ALDI Foto\\ALDI Foto.exe",
            "platformName": "Windows",
            "deviceName": "WindowsPC"
        })

        if (win.isVisible('name=A copy of the application is already running.', utils.shortWait)) {
            win.click('name=OK')
        }

        assert.equal(
            win.isVisible('name=Application'), true,
            `${app} has failed to load`
        )
    },

    isAppRunning: (query) => {
        let { execSync } = require('child_process')
        let platform = process.platform
        let cmd = ''
        switch(platform) {
            case 'win32': cmd = 'tasklist';
                break
            case 'darwin': cmd = `ps -ax | grep ${query}`
                break
            case 'linux': cmd = 'ps -A'
                break
            default: 
                break
        }
        return execSync(cmd).toString().toLowerCase().indexOf(query.toLowerCase()) > -1
    },

    closeApp: (app) => {
        let { execSync } = require('child_process')
        let proc = execSync(`wmic process where "name='${app}'" delete`)
        log.info(proc.toString().replace('\r\n', ` Closed ${app}`))
    },

    getCurrentDate: () => {
        let date = new Date()
        let dd = String(date.getDate()).padStart(2, "0")
        let mm = String(date.getMonth() + 1).padStart(2, "0")
        let yyyy = date.getFullYear()
        // let hours = date.getHours()
        // let minutes = date.getMinutes()
        // let seconds = date.getSeconds()
        // hours = hours < 10 ? '0' + hours : hours
        // minutes = minutes < 10 ? '0' + minutes : minutes
        // seconds = seconds < 10 ? '0' + seconds : seconds
        return `${dd}-${mm}-${yyyy}`
    },

}