const nav = po.nav
const func = po.functions
const monitors = require('../Scripts/monitors.js')

var startTime = func.getTime()
po.login(env.url, env.username, env.password)

web.transaction('04. Open Monitors')
po.click(nav.menuList('Monitoring'))
po.click(nav.monitors.monitorsLink)

web.transaction('05. Delete All Test Monitors')
monitors.deleteAllTestMonitors()

web.dispose('Passed')
var endTime = func.getTime()
log.info(`🛈 Test finished in ${(parseFloat(endTime - startTime) / 1000).toFixed(1)} seconds`)
