const nav = po.nav
const func = po.functions
const projects = require('../Scripts/projects.js')

var startTime = func.getTime()
po.login(env.url, env.username, env.password)

web.transaction('04. Open Projects')
po.click(nav.menuList('Projects'))
po.click(nav.projects.projectsLink)

web.transaction('05. Delete All Test Projects')
projects.deleteAllTestProjects()

web.dispose('Passed')
var endTime = func.getTime()
log.info(`🛈 Test finished in ${(parseFloat(endTime - startTime) / 1000).toFixed(1)} seconds`)
