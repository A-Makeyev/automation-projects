const func = po.functions
const cases = require('../Scripts/cases.js')
const projects = require('../Scripts/projects.js')
const monitors = require('../Scripts/monitors.js')
const environments = require('../Scripts/environments.js')
const randomNumber = func.generateNumber(1, 4)
const projectNumber = String(func.generateNumber(10000, 999999))
const projectName = `* Test Project ~ ${projectNumber}`
const environmentName = `Environment ~ ${projectNumber}`
const folderName = `Folder ~ ${projectNumber}`
const caseName = `Web Case ~ ${projectNumber}`
const monitorName = `Test Monitor ~ ${projectNumber}`
const slaName = `SLA ~ ${projectNumber}`
const policyName = `Policy ~ ${projectNumber}`
const slaNormalValue = func.generateNumber(51, 100)
const slaWarningValue = func.generateNumber(1, 50)
const policyRangeValue = func.generateNumber(1, 50)
const policyThreshold = func.generateNumber(51, 100)
const slaGoal = randomNumber ? 'Availability' : 'Performance' 
const policyMetric = randomNumber ? 'Monitor Availability' : 'Instance Availability' 
const policyIncidentSeverity = randomNumber ? 'Minor' : 'Critical' 
const policyRangeType = randomNumber == 1 ? 'Runs' : randomNumber == 2 ? 'Minutes' : randomNumber == 3 ? 'Hours' : 'Days' 

po.login(env.url, env.username, env.password)

web.transaction('04. Create New Project')
projects.createNewProject(projectName)

web.transaction('05. Create New Environment')
environments.createNewEnvironment(projectName, environmentName)

web.transaction('06. Create New Case - Web')
cases.createNewWebCase(projectName, environmentName, caseName, folderName)

web.transaction('07. Create New Monitor')
monitors.createNewMonitor(projectName, monitorName)

web.transaction('08. Create General SLA')
monitors.createGeneralSLA(slaName, slaGoal, slaNormalValue, slaWarningValue)

web.transaction(`09. Choose Browser ${env.browser}`)
func.chooseBrowser('Chrome', env.browser)

web.transaction(`10. Add environment ${environmentName} to Runtime`)
monitors.addRuntime(environmentName)

web.transaction('11. Add Cases')
monitors.addCases(monitorName, caseName, folderName)

web.transaction('12. Add Cases')
monitors.addPolicy(policyName, policyRangeType, policyRangeValue, policyThreshold, policyMetric, policyIncidentSeverity)

web.transaction(`13. Save and Run Monitor ${monitorName}`)
monitors.saveAndRun()

web.transaction('14. Assert Monitor Is Active')
monitors.assertMonitorIsActive(monitorName)

web.transaction(`15. Delete Monitor ${monitorName}`)
monitors.deleteMonitor(monitorName)

web.transaction(`16. Delete Project ${projectName}`)
projects.deleteProject(projectName)
