module.exports = {
    createNewEnvironment: (projectName, environmentName) => {
        const nav = po.nav
        const utils = po.utils
        const environments = po.environmentsPage

        web.pause(po.shortWait)
        po.click(nav.projects.environmentsLink)

        // choose the current project
        po.click(environments.projectRow)
        po.click(environments.projectItem(projectName))
        po.click(utils.addEnvironment)

        // create env
        po.type(environments.nameInput, environmentName)
        po.click(utils.add)
        web.pause(po.shortWait)

        // add details
        po.click(environments.dataRowAndCellInput('1', '1'))
        web.sendKeys('url')

        po.click(environments.dataRowAndCellInput('1', '2'))
        web.sendKeys(env.url)

        po.click(environments.dataRowAndCellInput('2', '1'))
        web.sendKeys('username')

        po.click(environments.dataRowAndCellInput('2', '2'))
        web.sendKeys(env.username)

        po.click(environments.dataRowAndCellInput('3', '1'))
        web.sendKeys('password')

        po.click(environments.dataRowAndCellInput('3', '2'))
        web.sendKeys(env.password)

        po.click(utils.saveEnv)

        if (web.isVisible(environments.savedSuccessfullyMessage)) {
            log.info(`✔️ Created ${environmentName}`)
        } else {
            log.info('❌ Failed to create an environment')
        }
    },

}
