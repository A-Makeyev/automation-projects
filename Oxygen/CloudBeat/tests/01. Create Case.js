/*
 * Sanity steps:
 * Create new project
 * Set an environment
 * Create a web case
 * Run the case
 * Assert the result
 * Delete the project
 */

const func = po.functions
const deleteProject = true
const cases = require('../Scripts/cases.js')
const projects = require('../Scripts/projects.js')
const environments = require('../Scripts/environments.js')
const projectNumber = String(func.generateNumber(10000, 999999))
const projectName = `* Test Project ~ ${projectNumber}`
const environmentName = `Environment ~ ${projectNumber}`
const folderName = `Folder ~ ${projectNumber}`
const caseName = `Web Case ~ ${projectNumber}`

po.login(env.url, env.username, env.password)

web.transaction('04. Create New Project')
projects.createNewProject(projectName)

web.transaction('05. Create New Environment')
environments.createNewEnvironment(projectName, environmentName)

web.transaction('06. Create New Case - Web')
cases.createNewWebCase(projectName, environmentName, caseName, folderName)

web.transaction(`07. Run Web Case ${caseName}`)
cases.runCase(caseName)

if (deleteProject) {
    web.transaction(`08. Delete Project ${projectName}`)
    projects.deleteProject(projectName)
}

/* todo: check defined variables */
 