const func = po.functions
const cases = require('../Scripts/cases.js')
const suites = require('../Scripts/suites.js')
const projects = require('../Scripts/projects.js')
const environments = require('../Scripts/environments.js')
const projectNumber = String(func.generateNumber(10000, 999999))
const projectName = `* Test Project ~ ${projectNumber}`
const environmentName = `Environment ~ ${projectNumber}`
const folderName = `Folder ~ ${projectNumber}`
const caseName = `Web Case ~ ${projectNumber}`
const suiteName = `Web Suite ~ ${projectNumber}`

po.login(env.url, env.username, env.password)

web.transaction('04. Create New Project')
projects.createNewProject(projectName)

web.transaction('05. Create New Environment')
environments.createNewEnvironment(projectName, environmentName)

web.transaction('06. Create New Case - Web')
cases.createNewWebCase(projectName, environmentName, caseName, folderName)

web.transaction('07. Create New Suite - Web')
suites.createNewWebSuite(projectName, environmentName, suiteName, caseName, folderName)

web.transaction(`08. Run ${suiteName}`)
suites.runSuite(suiteName, caseName)

web.transaction(`08. Delete Project ${projectName}`)
projects.deleteProject(projectName)
