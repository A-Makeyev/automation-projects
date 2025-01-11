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

    openProgram: (name) => {
        let { exec, execSync } = require('child_process')

        // prevent multiple pump simulators from being open
        if (po.isRunning('PumpSimulator.exe')) {
            po.closePrograms(['PumpSimulator.exe'])
        }

        if (name == 'Karnel.exe') {
            if (!po.isRunning('Kernel.exe')) {
                exec(`start ${po.karnelPath}`, { maxBuffer: 100 * 1024 * 1024 }, (e) => { if (e) log.info(`start ${po.karnelPath} error: ${e}`) }) 
            } else {
                po.closePrograms(['Kernel.exe'])
                exec(`start ${po.karnelPath}`, { maxBuffer: 100 * 1024 * 1024 }, (e) => { if (e) log.info(`start ${po.karnelPath} error: ${e}`) }) 
            }
        }

        if (name == 'PumpSimulator.exe') {
            exec(`start ${po.pumpSimulatorPath}`, { maxBuffer: 100 * 1024 * 1024 }, (e) => { if (e) log.info(`start ${po.pumpSimulatorPath} error: ${e}`) })
            utils.pause(po.oneMinute / 2)
            exec(`start ${po.appRunnerPath}`, { cwd: po.appDependenciesPath, maxBuffer: 100 * 1024 * 1024 }, (e) => { if (e) log.info(`start ${po.appRunnerPath} error: ${e}`) })
        }
    },

    closePrograms: (programs) => {
        // close the programs before test
        let { exec, execSync } = require('child_process')

        programs.forEach((program) => {
            let tries = 20
            while (po.isRunning(program)) {
                log.info(program)
                try {
                    // let proc = execSync(`TASKKILL /F /T /IM ${program}`)
                    let proc = execSync(`wmic process where "name='${program}'" delete`)
                    log.info(proc.toString().replace('\r\n', ` Closed ${program}`))
                } catch(e) {
                    log.info(e)
                }
                if (tries == 0) break
                else tries--
            }
        })
    },

    updateKarnelDBSettings: (service, resetKernel) => {
        vars.kernelUpdated = resetKernel
        log.info('Kernel Was Updated: ' + vars.kernelUpdated)
        
        if (vars.kernelUpdated) {
            utils.transaction('Update KarnelDB Settings')
            const fs = require('fs')
            const desktop = require('os').userInfo().homedir + '\\Desktop'
            const karnelDBSettings = fs.readFileSync(po.kernelDBPath).toString().split('\n')
            fs.writeFileSync(`${desktop}\\karnelDB-Copy.ini`, karnelDBSettings, 'utf8')

            if (resetKernel) {
                karnelDBSettings[18] = 'LastTransaction = 100000'
                log.info('Reset LastTransaction to 100000')
            } 

            var transactionNumber = karnelDBSettings[18].match(/\d+/g).join([])
            log.info('Transaction Number: ' + transactionNumber)
            
            service = service.toLowerCase()
            if (service == 'full service') {
                karnelDBSettings[334] = 'Terminal = XXX ,  0 , XXX , -XXXXXXXXXXX'
                karnelDBSettings[857] = 'AddOn = XXXX, 0, 0, 0, XXXXXXXXXXXX, 0, 0, Fuel, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, -X, תוספת שירות'
            }
            if (service == 'self service') karnelDBSettings[334] = 'Terminal = XXX ,  0 , XX , X , -SelfService , -XXXXXXXXXXXXXX'
            if (service == 'not allocated dual service') {
                karnelDBSettings[334] = 'Terminal = XXX ,  0 , XXX , -DualService , -XXXXXXXXXXXX'
                karnelDBSettings[857] = 'AddOn = XXXX, 0, 0, 0, XXXXXXXXXXXXX, XX, 0, 0, Fuel, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, -X, תוספת שירות'
            }
            if (service == 'allocated dual service') {
                karnelDBSettings[334] = 'Terminal = XXX ,  0 , XXX , X , -DualService , -XXXXXXXXXXXXX'
                karnelDBSettings[857] = 'AddOn = XXXX, 0, 0, 0, XXXXXXXXXXXXXX, XX, 0, 0, Fuel, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, -X, תוספת שירות'
            }
            log.info('Service: ' + karnelDBSettings[334])
            log.info('*'.repeat(100))

            karnelDBSettings[303] = 'Authorizer1 = X, XXX, 0, XXXXXXXXXXX, 0, XXXXXXX, 0, 0'
            karnelDBSettings[304] = 'Authorizer2 = X, XXX, 0, XXXXXXXXXX, 0, XXXXXXXX, 0, 0'
            karnelDBSettings[330] = 'Terminal2 = XXX ,  0 , XXX, XX, X, XX, -DevicesList: XXX  , -XXXXXXXXXXXXX'
            karnelDBSettings[331] = 'Terminal3 = XXX ,  XXXXXXXXXXXX , XXXX , XXXX ,  -Orpak , -SelfService , -DoLog -LogPath'
            karnelDBSettings[332] = 'Terminal4 = XXX ,  XXXXXXXXXXXX , XXXX , XXXX ,  -Orpak , -SelfService , -DoLog -LogPath'

            // find settings line
            for (let x = 0; x < karnelDBSettings.length; x++) {
                if (karnelDBSettings[x].includes('[Terminals]')) {
                    log.info(x + ' ' + karnelDBSettings[x])
                }
            }

            const newKarnelDBSettings = karnelDBSettings.join('\n')
            fs.writeFileSync(po.kernelDBPath, newKarnelDBSettings, 'utf8')

            utils.transaction('Run Kernel.exe')
            po.openProgram('Kernel.exe')
        }

    },

    initService: (serviceDataFile, expectedDataFile) => {
        // utils.transaction(`Initialize Service: ${serviceName}`)
        var serviceName = serviceDataFile.replace(' Data for', '')
        serviceName = serviceName.replace('.js', '')
        log.info('Starting: ' + serviceName)

        var getService = (arr) => {
            for (let x = 0; x < arr.length; x++) {
                if (arr[x].includes('Service')) {
                    return arr[x]
                }
            }
        }

        const fs = require('fs')
        const path = require('path')
        const settings = path.join(__dirname, './Settings')
        const serviceFolder = getService(serviceName.split(' '))
        const inputSettings = require(`${settings}\\${serviceFolder}\\${serviceDataFile}`) // -> take input from here
        const resultsLog = path.join(__dirname, `./Results/${po.getDate()}_Service_${serviceName}.txt`)

        // load the specific data for this test
        fs.writeFileSync(po.inputFilePath, inputSettings.data, 'utf8') 

        // initialize karnel
        if (fs.existsSync(po.kernelDBPath) && fs.existsSync(po.inputFilePath)) {
            log.info('*'.repeat(100))

            var resultsLengthBefore = fs.readFileSync(po.resultsPath, 'utf-8').toString().split('\n').length
            log.info('Results Before Pumping: ' + resultsLengthBefore)

            utils.transaction('Run PumpSimulator.exe')
            po.openProgram('PumpSimulator.exe')

            let tries = 20
            while (po.isRunning('TerminalIlustration.exe')) {
                if (tries == 0) break
                log.info('Pumping...')
                utils.pause(po.oneMinute / 4)
                tries--
            }

            var resultsLengthAfter = fs.readFileSync(po.resultsPath, 'utf-8').toString().split('\n').length
            log.info('Results After Pumping: ' + resultsLengthAfter)

            // check if new results line was added
            if (resultsLengthAfter == (resultsLengthBefore + 1)) {
                log.info('Added another row to the results file')
            }

            var results = fs.readFileSync(po.resultsPath, 'utf-8').toString().split('\n')
            var actualResults = results[results.length - 2].split(',') // avoid empty line

            // last row results
            let tcrTime = actualResults[0]
            let stAuditTime = actualResults[1]
            let nInitiator = actualResults[2]
            let nScriptType = actualResults[3]
            let nStationID = actualResults[4]
            let nOwnerAgentID = actualResults[5]
            let nSuplierID = actualResults[6]
            let stCardNumber = actualResults[7]
            let nVevicleID = actualResults[15]
            let nTransactionID = actualResults[18]
            let nAuthorizer = actualResults[22]
            let nNozzelID = actualResults[24]
            let nFuelType = actualResults[25]
            let nTierLevel = actualResults[26]
            let nFuelCost = actualResults[28]
            let nTotalCost = actualResults[30]
            let nProductCount = actualResults[31]
            let stFuelingEnd = actualResults[35]
            let stDoneTime = actualResults[36]
            let Preset = actualResults[39]
            let nLimitUnits = actualResults[40]
            let CopiesCount = actualResults[43]           
            let CardDetails = actualResults[46]
            let FuelLitersMililiter = actualResults[47]

            log.info('*'.repeat(100))
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
            log.info('nNozzelID: ' + nNozzelID)
            log.info('nFuelType: ' + nFuelType)
            log.info('nTierLevel: ' + nTierLevel)
            log.info('nFuelCost: ' + nFuelCost)
            log.info('nTotalCost: ' + nTotalCost)
            log.info('nProductCount: ' + nProductCount)
            log.info('stFuelingEnd: ' + stFuelingEnd)
            log.info('stDoneTime: ' + stDoneTime)
            log.info('Preset: ' + Preset)
            log.info('nLimitUnits: ' + nLimitUnits)
            log.info('CopiesCount: ' + CopiesCount)
            log.info('CardDetails: ' + CardDetails)
            log.info('FuelLitersMililiter: ' + FuelLitersMililiter)
            log.info('*'.repeat(100))

            // Load Expected Results Data
            let expectedResultsPath = `./Expected Results/${serviceFolder}/${expectedDataFile}`
            let expectedResult = require(expectedResultsPath)
            let lastResult = expectedResult.data.split(',')

            let lastResult_tcrTime = lastResult[0]
            let lastResult_stAuditTime = lastResult[1]
            let lastResult_nInitiator = lastResult[2]
            let lastResult_nScriptType = lastResult[3]
            let lastResult_nStationID = lastResult[4]
            let lastResult_nOwnerAgentID = lastResult[5]
            let lastResult_nSuplierID = lastResult[6]
            let lastResult_stCardNumber = lastResult[7]
            let lastResult_nVevicleID = lastResult[15]
            let lastResult_nTransactionID = lastResult[18]
            let lastResult_nAuthorizer = lastResult[22]
            let lastResult_nNozzelID = lastResult[24]
            let lastResult_nFuelType = lastResult[25]
            let lastResult_nTierLevel = lastResult[26]
            let lastResult_nFuelCost = lastResult[28]
            let lastResult_nTotalCost = lastResult[30]
            let lastResult_nProductCount = lastResult[31]
            let lastResult_stFuelingEnd = lastResult[35]
            let lastResult_stDoneTime = lastResult[36]
            let lastResult_Preset = lastResult[39]
            let lastResult_nLimitUnits = lastResult[40]
            let lastResult_CopiesCount = lastResult[43]
            let lastResult_CardDetails = lastResult[46]
            let lastResult_FuelLitersMililiter = lastResult[47]

            // utils.transaction('Assert Results')
            var failedResults = []

            if (tcrTime == '') assert.fail('tcrTime is empty')
            if (stAuditTime == '') assert.fail('stAuditTime is empty')
            if (nInitiator == '') assert.fail('nInitiator is empty')
            if (nStationID == '') assert.fail('nStationID is empty')
            if (nOwnerAgentID == '') assert.fail('nOwnerAgentID is empty')
            if (nSuplierID == '') assert.fail('nSuplierID is empty')
            if (stFuelingEnd == '') assert.fail('stFuelingEnd is empty')
            if (stDoneTime == '') assert.fail('stDoneTime is empty')

            if (nScriptType == lastResult_nScriptType) log.info(`✔ nScriptType (${nScriptType}) equals ${lastResult_nScriptType}`)
            else failedResults.push(`❌ Expected nScriptType to equal ${lastResult_nScriptType}, instead got: ${nScriptType}`)

            if (stCardNumber == lastResult_stCardNumber) log.info(`✔ stCardNumber (${stCardNumber}) equals ${lastResult_stCardNumber}`)
            else failedResults.push(`❌ Expected stCardNumber to equal ${lastResult_stCardNumber}, instead got: ${stCardNumber}`)     

            if (nVevicleID == lastResult_nVevicleID) log.info(`✔ nVevicleID (${nVevicleID}) equals ${lastResult_nVevicleID}`)
            else failedResults.push(`❌ Expected nVevicleID to equal ${lastResult_nVevicleID}, instead got: ${nVevicleID}`)

            if (nAuthorizer == lastResult_nAuthorizer) log.info(`✔ nAuthorizer (${nAuthorizer}) equals ${lastResult_nAuthorizer}`)
            else failedResults.push(`❌ Expected nAuthorizer to equal ${lastResult_nAuthorizer}, instead got: ${nAuthorizer}`)

            if (nNozzelID == lastResult_nNozzelID) log.info(`✔ nNozzelID (${nNozzelID}) equals ${lastResult_nNozzelID}`)
            else failedResults.push(`❌ Expected nNozzelID to equal ${lastResult_nNozzelID}, instead got: ${nNozzelID}`)

            if (nFuelType == lastResult_nFuelType) log.info(`✔ nFuelType (${nFuelType}) equals ${lastResult_nFuelType}`)
            else failedResults.push(`❌ Expected nFuelType to equal ${lastResult_nFuelType}, instead got: ${nFuelType}`)

            if (nTierLevel == lastResult_nTierLevel) log.info(`✔ nTierLevel (${nTierLevel}) equals ${lastResult_nTierLevel}`)
            else failedResults.push(`❌ Expected nFuelType to equal ${lastResult_nTierLevel}, instead got: ${nTierLevel}`)

            if (nFuelCost == lastResult_nFuelCost) log.info(`✔ nFuelCost (${nFuelCost}) equals ${lastResult_nFuelCost}`)
            else failedResults.push(`❌ Expected nFuelCost to equal ${lastResult_nFuelCost}, instead got: ${nFuelCost}`)

            if (nTotalCost == lastResult_nTotalCost) log.info(`✔ nTotalCost (${nTotalCost}) equals ${lastResult_nTotalCost}`)
            else failedResults.push(`❌ Expected nTotalCost to equal ${lastResult_nTotalCost}, instead got: ${nTotalCost}`)

            if (nProductCount == lastResult_nProductCount) log.info(`✔ nProductCount (${nProductCount}) equals ${lastResult_nProductCount}`)
            else failedResults.push(`❌ Expected nProductCount to equal ${lastResult_nProductCount}, instead got: ${nProductCount}`)           

            if (Preset == lastResult_Preset) log.info(`✔ Preset (${Preset}) equals ${lastResult_Preset}`)
            else failedResults.push(`❌ Expected Preset to equal ${lastResult_Preset}, instead got: ${Preset}`) 

            if (nLimitUnits == lastResult_nLimitUnits) log.info(`✔ nLimitUnits (${nLimitUnits}) equals ${lastResult_nLimitUnits}`)
            else failedResults.push(`❌ Expected nLimitUnits to equal ${lastResult_nLimitUnits}, instead got: ${nLimitUnits}`) 

            if (CopiesCount == lastResult_CopiesCount) log.info(`✔ CopiesCount (${CopiesCount}) equals ${lastResult_CopiesCount}`)
            else failedResults.push(`❌ Expected CopiesCount to equal ${lastResult_CopiesCount}, instead got: ${CopiesCount}`) 

            if (CardDetails == lastResult_CardDetails) log.info(`✔ CardDetails (${CardDetails}) equals ${lastResult_CardDetails}`)
            else failedResults.push(`❌ Expected CardDetails to equal ${lastResult_CardDetails}, instead got: ${CardDetails}`)

            if (FuelLitersMililiter == lastResult_FuelLitersMililiter) log.info(`✔ FuelLitersMililiter (${FuelLitersMililiter}) equals ${lastResult_FuelLitersMililiter}`)
            else failedResults.push(`❌ Expected FuelLitersMililiter to equal ${lastResult_FuelLitersMililiter}, instead got: ${FuelLitersMililiter}`)

            if (failedResults.length > 0) {
                log.info('*'.repeat(100))
                log.info('Failed Results:')
                for (let x = 0; x < failedResults.length; x++) log.info(`${failedResults[x]}`)
                assert.fail(`Some results don't match`)
            }

            fs.appendFileSync(resultsLog, results[results.length - 2] + '\n')

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
