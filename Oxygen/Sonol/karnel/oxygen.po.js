module.exports = {

    oneMinute: 60000,
    appDependenciesPath: 'C:\\Sonol\\terminal-simulator2022', // -> app dependencies
    appRunnerPath: 'C:\\Sonol\\terminal-simulator2022\\TerminalIlustration.exe', // -> app runner
    inputFilePath: 'C:\\Sonol\\terminal-simulator2022\\files\\inputFile.jur', // -> place input here
    kernelDBPath: 'C:\\Sonol\\KernelDB.ini', // -> replace karnelDB setting here
    resultsPath: 'C:\\Sonol\\Kernel.Lst', // -> take results from here
    pumpSimulatorPath: 'C:\\Sonol\\PumpSimulator\\PumpSimulator.exe',
    karnelPath: 'C:\\Sonol\\Kernel.exe',

    isRunning: (query) => {
        let { exec, execSync } = require('child_process')
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

    openPrograms: () => {
        let { exec, execSync } = require('child_process')

        // prevent multiple pump simulators from being open
        if (po.isRunning('PumpSimulator.exe')) {
            let tries = 20
            while (po.isRunning('PumpSimulator.exe')) {
                po.closePrograms(['PumpSimulator.exe'])
                if (tries == 0) break
                else tries--
            }
        }

        if (!po.isRunning('Kernel.exe')) {
            exec(`start ${po.karnelPath}`, { maxBuffer: 100 * 1024 * 1024 }, (e) => { if (e) log.info(`start ${po.karnelPath} error: ${e}`) }) 
        } 
        exec(`start ${po.pumpSimulatorPath}`, { maxBuffer: 100 * 1024 * 1024 }, (e) => { if (e) log.info(`start ${po.pumpSimulatorPath} error: ${e}`) })
        utils.pause(po.oneMinute / 2)
        exec(`start ${po.appRunnerPath}`, { cwd: po.appDependenciesPath, maxBuffer: 100 * 1024 * 1024 }, (e) => { if (e) log.info(`start ${po.appRunnerPath} error: ${e}`) })
    },

    closePrograms: (programs) => {
        // close the programs before test
        let { exec, execSync } = require('child_process')

        programs.forEach((program) => {
            if (po.isRunning(program)) {
                try {
                    let proc = execSync(`TASKKILL /F /T /IM ${program}`)
                    log.info(proc.toString().replace('\r\n', ` Closed ${program}`))
                } catch(e) {
                    log.info(e)
                }
            }
        })
    },

    updateKarnelDBSettings: (service, resetLastTransaction) => {
        utils.transaction('Update KarnelDB Settings')
        const fs = require('fs')
        const desktop = require('os').userInfo().homedir + '\\Desktop'
        const karnelDBSettings = fs.readFileSync(po.kernelDBPath).toString().split('\n')
        fs.writeFileSync(`${desktop}\\karnelDB-Copy.ini`, karnelDBSettings, 'utf8')

        if (resetLastTransaction) {
            karnelDBSettings[18] = 'LastTransaction = 100000'
            log.info('Reset LastTransaction to 100000')
        } 

        // var transactionNumber = karnelDBSettings[18].match(/\d+/g).join([])
        // log.info('Transaction Number: ' + transactionNumber)

        service = service.toLowerCase()
        if (service == 'full service') karnelDBSettings[331] = 'Terminal5 = Panel ,  0 , 70 , -TCPIP:127.0.0.1:2500'
        if (service == 'self service') karnelDBSettings[331] = 'Terminal5 = Panel ,  0 , 70 , 3 , -SelfService , -TCPIP:127.0.0.1:2500'
        if (service == 'dual service not allocated') karnelDBSettings[331] = 'Terminal5 = Panel ,  0 , 70 , -DualService , -TCPIP:127.0.0.1:2500'
        if (service == 'dual service allocated') karnelDBSettings[331] = 'Terminal5 = Panel ,  0 , 70 , 2 , -DualService , -TCPIP:127.0.0.1:2500'
        log.info('Service: ' + karnelDBSettings[331])
        log.info('*'.repeat(100))

        karnelDBSettings[298] = 'Authorizer1 = 1, 111, 0, 05/07/21-10:28:02, 0, 020785, 0, 0'
        karnelDBSettings[299] = 'Authorizer20 = 1, 801, 0, 21/07/22-14:05:35, 0, 016849, 0, 0'
        karnelDBSettings[329] = 'Terminal1 = Cash ,  200.200.230.13 , 29298 , 253 ,  -Orpak , -SelfService , -DoLog -LogPath'
        karnelDBSettings[330] = 'Terminal2 = Cash ,  200.200.230.13 , 29299 , 254 ,  -Orpak , -SelfService , -DoLog -LogPath'
        karnelDBSettings[332] = 'Terminal6 = Printer ,  0 , 112, 30, 3, 00, -DevicesList: 5  , -TCPIP:200.200.230.70:3485'

        // find settings line
        // for (let x = 0; x < karnelDBSettings.length; x++) {
        //     if (karnelDBSettings[x].includes('[Terminals]')) {
        //         log.info(x + ' ' + karnelDBSettings[x])
        //     }
        // }

        const newKarnelDBSettings = karnelDBSettings.join('\n')
        fs.writeFileSync(po.kernelDBPath, newKarnelDBSettings, 'utf8')
    },

    initService: (serviceDataFile) => {
        utils.transaction(`Initialize Service: ${serviceName}`)
        var serviceName = serviceDataFile.replace(' Data for', '')
        serviceName = serviceName.replace('.js', '')
        log.info('Starting: ' + serviceName)

        const fs = require('fs')
        const path = require('path')
        const settings = path.join(__dirname, './Settings')
        const inputSettings = require(settings + '\\SelfService\\' + serviceDataFile) // -> take input from here
        const resultsLog = path.join(__dirname, `./Results/${po.getDate()}_Service_${serviceName}.txt`)

        // load the specific data for this test
        fs.writeFileSync(po.inputFilePath, inputSettings.data, 'utf8') 

        // initialize karnel
        if (fs.existsSync(po.kernelDBPath) && fs.existsSync(po.inputFilePath)) {
            log.info('*'.repeat(100))

            var resultsLengthBefore = fs.readFileSync(po.resultsPath, 'utf-8').toString().split('\n').length
            log.info('Results Before Pumping: ' + resultsLengthBefore)

            utils.transaction('Run Programs')
            po.openPrograms()

            let tries = 20
            while (po.isRunning('TerminalIlustration.exe')) {
                if (tries == 0) break
                log.info('Pumping...')
                utils.pause(po.oneMinute / 4)
                tries--
            }

            utils.transaction('Assert Results')
            var resultsLengthAfter = fs.readFileSync(po.resultsPath, 'utf-8').toString().split('\n').length
            log.info('Results After Pumping: ' + resultsLengthAfter)
            log.info('*'.repeat(100))

            // check if new results line was added
            if (resultsLengthAfter == (resultsLengthBefore + 1)) {
                var results = fs.readFileSync(po.resultsPath, 'utf-8').toString().split('\n')
                var lastResult = results[results.length - 2].split(',') // avoid empty line

                // last row results
                let tcrTime = lastResult[0]
                let stAuditTime = lastResult[1]
                let nInitiator = lastResult[2]
                let nScriptType = lastResult[3]
                let nStationID = lastResult[4]
                let nOwnerAgentID = lastResult[5]
                let nSuplierID = lastResult[6]
                let stCardNumber = lastResult[7]
                let nVevicleID = lastResult[15]
                let nTransactionID = lastResult[18]
                let nAuthorizer = lastResult[22]
                let nFuelCost = lastResult[28]
                let nTotalCost = lastResult[30]
                let stFuelingEnd = lastResult[35]
                let stDoneTime = lastResult[36]
                let CardDetails = lastResult[46]
                let FuelLitersMililiter = lastResult[47]

                log.info('tcrTime: ' + tcrTime)
                log.info('stAuditTime: ' + stAuditTime)
                log.info('nInitiator: ' + nInitiator)
                log.info('nScriptType: ' + nScriptType)
                log.info('nStationID: ' + nStationID)
                log.info('nOwnerAgentID: ' + nOwnerAgentID)
                log.info('nSuplierID: ' + nSuplierID)
                log.info('stCardNumber: ' + stCardNumber)
                log.info('nVevicleID: ' + nVevicleID)
                log.info('nTransactionID: ' + nTransactionID)
                log.info('nAuthorizer: ' + nAuthorizer)
                log.info('nFuelCost: ' + nFuelCost)
                log.info('nTotalCost: ' + nTotalCost)
                log.info('stFuelingEnd: ' + stFuelingEnd)
                log.info('stDoneTime: ' + stDoneTime)
                log.info('CardDetails: ' + CardDetails)
                log.info('FuelLitersMililiter: ' + FuelLitersMililiter)
            }

            // fs.appendFileSync(resultsLog, results[results.length - 2] + '\n')

        } else {
            assert.fail('Failed to load pre test files (KarnelDB.Ini, inputFile.jur)')
        }
    },

    getDate: () => {
        let date = new Date()
        let day = String(date.getDate()).padStart(2, '0')
        let month = String(date.getMonth() +1).padStart(2, '0')
        let year = date.getFullYear()
        let hours = date.getHours()
        let minutes = date.getMinutes()
        let seconds = date.getSeconds()

        hours = hours < 10 ? `0${hours}` : hours
        minutes = minutes < 10 ? `0${minutes}` : minutes
        seconds = seconds < 10 ? `0${seconds}` : seconds

        return `${day}-${month}-${year}_${hours}h-${minutes}m-${seconds}s`
    },
}
