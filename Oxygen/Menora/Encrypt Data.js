
writeJson('technologicalInfrastructures_Commvault-482', 'Encrypted-Data', 'xxx.xx.xx.xx')
writeFile('technologicalInfrastructures_Commvault-482', 'Encrypted-Data', 'xxx.xx.xx.xx')


function writeJson(project, dir, url, user, pass, id, phone, policy, heskem, tvia, name) {
    // https://jsonformatter.curiousconcept.com

    let testScript = project.substring(project.indexOf('_') + 1)
    testScript = testScript.includes('-') ? testScript.substring(0, testScript.indexOf('-')) : testScript.substring(0)
    
    let fs = require('fs')
    let fileDir = `${require('os').userInfo().homedir}\\Desktop\\${dir}`
    let filePath = `${fileDir}\\Info.json`

    try {
        if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir)
        if (!fs.existsSync(filePath)) fs.appendFileSync(filePath, '{ \n')

        if (url) {
            fs.appendFileSync(filePath, `  "${testScript}_url": "${url}", \n`)
            fs.appendFileSync(filePath, `  "${testScript}_encryptedUrl": "${utils.encrypt(url)}", \n`)
        }

        if (user) {
            fs.appendFileSync(filePath, `  "${testScript}_user": "${user}", \n`)
            fs.appendFileSync(filePath, `  "${testScript}_encryptedUser": "${utils.encrypt(user)}", \n`)
        }

        if (pass) {
            fs.appendFileSync(filePath, `  "${testScript}_pass": "${pass}", \n`)
            fs.appendFileSync(filePath, `  "${testScript}_encryptedPass": "${utils.encrypt(pass)}", \n`)
        }

        if (id) {
            fs.appendFileSync(filePath, `  "${testScript}_id": "${id}", \n`)
            fs.appendFileSync(filePath, `  "${testScript}_encryptedId": "${utils.encrypt(id)}", \n`)
        }

        if (phone) {
            fs.appendFileSync(filePath, `  "${testScript}_phone": "${phone}", \n`)
            fs.appendFileSync(filePath, `  "${testScript}_encryptedPhone": "${utils.encrypt(phone)}", \n`)
        }

        if (policy) {
            fs.appendFileSync(filePath, `  "${testScript}_policy": "${policy}", \n`)
            fs.appendFileSync(filePath, `  "${testScript}_encryptedPolicy": "${utils.encrypt(policy)}", \n`)
        }

        if (heskem) {
            fs.appendFileSync(filePath, `  "${testScript}_heskem": "${heskem}", \n`)
            fs.appendFileSync(filePath, `  "${testScript}_encryptedHeskem": "${utils.encrypt(heskem)}", \n`)
        }

        if (tvia) {
            fs.appendFileSync(filePath, `  "${testScript}_tvia": "${tvia}", \n`)
            fs.appendFileSync(filePath, `  "${testScript}_encryptedTvia": "${utils.encrypt(tvia)}", \n`)
        }

        if (name) {
            fs.appendFileSync(filePath, `  "${testScript}_name": "${name}", \n`)
            fs.appendFileSync(filePath, `  "${testScript}_encryptedName": "${utils.encrypt(name)}", \n`)
        }

    } catch(e) {
        log.error(e)
    }
}

function writeFile(project, dir, url, user, pass, id, phone, policy, heskem, tvia, name) { 
    let fs = require('fs')
    let fileDir = `${require('os').userInfo().homedir}\\Desktop\\${dir}`
    let filePath = `${fileDir}\\Info.txt`

    try {
        if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir)

        fs.appendFileSync(
            filePath,
            '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
            + '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~' 
            + '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \n'
            + '                         ' + project 
            + '\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
            + '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
            + '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \n\n'
        )

        if (url) fs.appendFileSync(filePath, `URL/IP: ${url} -> ${utils.encrypt(url)} \n\n`)
        if (user) fs.appendFileSync(filePath, `Username: ${user} -> ${utils.encrypt(user)} \n\n`)
        if (pass) fs.appendFileSync(filePath, `Password: ${pass} -> ${utils.encrypt(pass)} \n\n`)
        if (id) fs.appendFileSync(filePath, `ID: ${id} -> ${utils.encrypt(id)} \n\n`)
        if (phone) fs.appendFileSync(filePath, `Phone: ${phone} -> ${utils.encrypt(phone)} \n\n`)
        if (policy) fs.appendFileSync(filePath, `Policy: ${policy} -> ${utils.encrypt(policy)} \n\n`)
        if (heskem) fs.appendFileSync(filePath, `Heskem: ${heskem} -> ${utils.encrypt(heskem)} \n\n`)
        if (tvia) fs.appendFileSync(filePath, `Tvia: ${tvia} -> ${utils.encrypt(tvia)} \n\n`)
        if (name) fs.appendFileSync(filePath, `Name: ${name} -> ${utils.encrypt(name)} \n\n`)

    } catch(e) {
        log.error(e)
    }
}
