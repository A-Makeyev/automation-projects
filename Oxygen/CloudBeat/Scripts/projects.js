module.exports = {
    createNewProject: (projectName) => {
        const nav = po.nav
        const utils = po.utils
        const projects = po.projectsPage

        po.click(nav.menuList('Projects'))
        po.click(nav.projects.projectsLink)

        po.click(utils.addProject)
        po.type(projects.newProjectNameInput, projectName)

        po.click(utils.next)
        po.click(utils.next)
        po.click(utils.finish)

        if (!web.isVisible(projects.projectNode(projectName))) {
            assert.fail('There was a problem creating a project')
        } else {
            log.info(`✔️ Created ${projectName}`)
        }
    },

    deleteProject(projectName) {
        const projects = po.projectsPage

        web.clickHidden(po.nav.projects.projectsLink)
        web.pause(po.waitASecond)
        
        web.rightClick(projects.projectNode(projectName))
        po.click(projects.confirmDeleteBtn(projectName))

        web.waitForVisible(po.utils.confirm)
        po.click(po.utils.deleteBtn)
        web.pause(po.shortWait)
        
        if (!web.isVisible(projects.projectNode(projectName), po.shortWait)) {
            log.info(`✔️ Deleted ${projectName}`)
        } else {
            log.info(`❌ There was a problem with deleting ${projectName}`)
        }
    }, 

    deleteAllTestProjects: () => {
        const projects = po.projectsPage

        const testProjects = web.getElementCount(projects.testProjects)
        if (testProjects == 0) {
            log.info('🛈 There are no Test Projects available')
        } else {
            for (let i = 1; i <= testProjects; i++) {
                // this.projects.deleteProject('Test Project')

                web.pause(po.waitASecond)
                let projectElement = `(${projects.testProjects})[1]`
                let projectName = web.getText(projectElement)

                web.rightClick(projectElement)
                po.click(projects.confirmDeleteBtn(projectName))

                web.waitForVisible(po.utils.confirm)
                po.click(po.utils.deleteBtn)
                web.pause(po.shortWait)
                
                if (!web.isVisible(projects.projectNode(projectName), po.shortWait)) {
                    log.info(`✔️ Deleted ${projectName}`)
                } else {
                    log.info(`❌ There was a problem with deleting ${projectName}`)
                }
            }
        }
    },

}
