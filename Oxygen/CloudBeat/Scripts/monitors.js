module.exports = {
    createNewMonitor: (projectName, monitorName) => {
        const nav = po.nav
        const monitors = po.monitorsPage

        po.click(nav.menuList('Monitoring'))
        po.click(nav.monitors.monitorsLink)

        po.click(monitors.addMonitorBtn)
        if (web.isVisible(monitors.addNewMonitorHeader)) {
            po.type(monitors.monitorNameInput, monitorName)
            po.click(monitors.projectSelectInput)

            let tries = 30
            let elements = web.getElementCount(monitors.projectSelectOptions)
            let projectSelect = monitors.projectSelectOption(projectName)

            if (web.isVisible(projectSelect, po.waitASecond)) {
                po.click(projectSelect)
            } else {
                while (!web.isVisible(projectSelect, po.shortWait)) {
                    if (tries == 0) break

                    web.scrollToElement(`(${monitors.projectSelectOptions})[${parseInt(elements / 2)}]`)
                    if (web.isVisible(projectSelect, po.waitASecond)) {
                        po.click(projectSelect)
                        break
                    } else {
                        elements = web.getElementCount(monitors.projectSelectOptions)
                        tries--
                    }
                }
            }

            po.click(monitors.testModeSelectInput)
            po.click(monitors.webMode)
            po.click(monitors.addNewMonitorBtn)
        } else {
            log.info('❌ Add New Monitor Window failed to open')
        }

        if (web.isVisible(monitors.monitorHeader(monitorName))) {
            log.info(`✔️ Created new monitor: ${monitorName}`)
        } else {
            assert.fail('❌ Failed to create new monitor')
        }
    },

    createGeneralSLA: (slaName, goal, normalValue, warningValue) => {
        const monitors = po.monitorsPage

        po.click(po.utils.tabList.sla)
        po.click(monitors.newGeneralSlaBtn)

        if (web.isVisible(monitors.newSlaHeader)) {
            po.type(monitors.newSlaNameInput, slaName)
            po.type(monitors.newSlaNormalInput, normalValue)
            po.type(monitors.newSlaWarningInput, warningValue)
            po.click(monitors.saveNewSlaBtn)
        } else {
            log.info('❌ Add New General SLA Window failed to open')
        }

        if (web.isVisible(monitors.generalSlaNameDataCell(slaName))) {
            log.info(`✔️ Created new SLA: ${slaName}`)
        } else {
            log.info(`❌ SLA NAME (${slaName}) is not visible after creating new SLA`)
        }

        if (web.isVisible(monitors.generalSlaGoalDataCell(slaName, goal))) {
            log.info(`✔️ ${slaName} GOAL: ${web.getText(monitors.generalSlaGoalDataCell(slaName, goal))}`)
        } else {
            log.info(`❌ SLA GOAL (${goal}) is not visible after creating new SLA`)
        }

        if (web.isVisible(monitors.generalSlaValues(slaName, normalValue, warningValue))) {
            log.info(`✔️ ${slaName} THRESHOLDS: ${web.getText(monitors.generalSlaValues(slaName, normalValue, warningValue))}`)
        } else {
            log.info(`❌ SLA THRESHOLDS normal (${normalValue}) warning (${warningValue}) are not visible after creating new SLA`)
        }

        assert.equal(
            web.isVisible(monitors.generalSlaNameDataCell(slaName)) 
            && web.isVisible(monitors.generalSlaGoalDataCell(slaName, goal)) 
            && web.isVisible(monitors.generalSlaValues(slaName, normalValue, warningValue)),
            true, `Failed to create SLA (${slaName}) with the given parameters: goal -> ${goal}, normal -> ${normalValue}, warning -> ${warningValue}`
        )
    },  

    addCases: (monitorName, caseName, folderName) => {
        const utils = po.utils
        const monitors = po.monitorsPage

        po.click(utils.tabList.cases)
        po.click(utils.addCasesBtn)

        if (!web.isVisible(utils.addCasesWindowHeader)) {
            log.info('❌ Failed to open Add Cases to Monitor window')
        } else {
            po.click(utils.addCaseCheckbox(caseName))
            po.click(utils.addSelectedCasesBtn)

            if (web.isVisible(utils.caseItem(caseName))) {
                log.info(`✔️ Added case ${caseName} to monitor`)
            } else {
                assert.fail(`❌ Failed to add case ${caseName} to monitor ${monitorName}`)
            }
        }
    },

    addRuntime: (environmentName) => {
        po.click(po.utils.tabList.runtime) 
        po.utils.selectEnvironment(environmentName)
    },

    addPolicy: (policyName, rangeType, rangeValue, threshold, metric, severity) => {
        const utils = po.utils
        const monitors = po.monitorsPage

        po.click(utils.tabList.policies) 
        po.click(monitors.newPolicyBtn)

        if (web.isVisible(monitors.newPolicyHeader)) {
            po.type(monitors.newPolicyNameInput, policyName)
            po.click(monitors.newPolicyRangeType(rangeType))

            po.type(monitors.newPolicyRangeInput, rangeValue)
            po.type(monitors.newPolicyThresholdInput, threshold)

            po.click(monitors.incidentSeveritySelectInput)
            po.click(monitors.incidentSeverityOption(severity))
            po.click(monitors.saveNewPolicyBtn)

            let newPolicyElement = monitors.policyItem(policyName, rangeType, metric, threshold, severity)
            if (web.isVisible(newPolicyElement)) {
                log.info(`✔️ Added ${policyName} to incident policy list`)
                log.info(`✔️ ${policyName} Range Type: ${web.getText(monitors.policyItemRangeType(policyName, rangeType))}`)
                log.info(`✔️ ${policyName} Metric & Threshold: ${web.getText(monitors.policyItemMetricAndThreshold(policyName, rangeType, metric, threshold))}`)
                log.info(`✔️ ${policyName} Severity: ${web.getText(monitors.policyItemSeverity(policyName, rangeType, metric, threshold, severity))}`)

                po.click(monitors.deletePolicyItemBtn(newPolicyElement))
                if (web.isVisible(utils.confirmWindowHeader)) {
                    po.click(utils.confirmYesBtn)
                    web.pause(po.shortWait)

                    if (web.isVisible(monitors.policyListNoResultsText, po.longWait)) {
                        log.info(`✔️ Deleted ${policyName}`)
                    } else {
                        log.info(`❌ There was a problem with deleting ${policyName}`)
                    }
                } else {
                    log.info('❌ Failed to open delete policy confirm window')
                }
            } else {
                log.info(`❌ Failed to add ${policyName} to incident policy list`)
            }
        } else {  
            log.info('❌ Add Incident Policy Window failed to open')
        }
    },

    assertMonitorIsActive: (monitorName) => {
        po.click(po.nav.tests.activeRuns)
        assert.equal(
            web.isVisible(po.resultsPage.expectedMonitorElement(monitorName)), true,
            `❌ Monitor ${monitorName} doesn't appear in active runs after creation`
        )
        log.info(`✔️ Monitor ${monitorName} appears in active runs after creation`)
    },

    saveAndRun: () => {
        const utils = po.utils
        
        if (web.isVisible(utils.saveChanges, po.shortWait)) {
            po.click(utils.saveChanges)
        } 

        po.click(utils.casesAndMonitorsMenu)
        po.click(utils.runMonitorBtn)

        let tries = 5
        while (!web.isVisible(utils.noticeMessage, po.shortWait) && tries > 0) {
            po.click(utils.casesAndMonitorsMenu)
            po.click(utils.runMonitorBtn)

            web.isVisible(utils.noticeMessage, po.waitASecond) && log.info('🛈 ' + web.getText(utils.noticeMessage))
            tries--   
        }
    },

    deleteMonitor: (monitorName) => {
        const utils = po.utils
        const monitors = po.monitorsPage
        const monitorElement = monitors.monitorListItem(monitorName)

        po.click(po.nav.monitors.monitorsLink)
        po.click(monitorElement)

        po.click(monitors.editMonitorBtn)
        po.click(utils.casesAndMonitorsMenu)
        po.click(monitors.deleteMonitorBtn)

        if (web.isVisible(utils.confirmWindowHeader)) {
            po.click(utils.confirmYesBtn)
            web.pause(po.shortWait)

            if (web.isVisible(monitorElement, po.shortWait)) {
                log.info(`❌ There was a problem with deleting ${monitorName}`)
            } else {
                log.info(`✔️ Deleted ${monitorName}`)
            }
        } else {
            log.info('❌ Failed to open delete monitor confirm window')
        }
    },

    deleteAllTestMonitors: () => {
        const utils = po.utils
        const monitors = po.monitorsPage
        const testMonitors = web.getElementCount(monitors.testMonitors)

        if (testMonitors == 0) {
            log.info('🛈 There are no Test Monitors available')
        } else {
            for (let i = 1; i <= testMonitors; i++) {
                web.pause(po.waitASecond)
                let monitorName = web.getText(`(${monitors.testMonitors})[1]`)

                po.click(`(${monitors.testMonitors})[1]`)
                po.click(monitors.editMonitorBtn)
                po.click(utils.casesAndMonitorsMenu)
                po.click(monitors.deleteMonitorBtn)

                if (web.isVisible(utils.confirmWindowHeader)) {
                    po.click(utils.confirmYesBtn)
                    web.pause(po.shortWait)

                    if (web.isVisible(monitors.monitorListItem(monitorName), po.shortWait)) {
                        log.info(`❌ There was a problem with deleting ${monitorName}`)
                    } else {
                        log.info(`✔️ Deleted ${monitorName}`)
                    }
                } else {
                    log.info('❌ Failed to open delete monitor confirm window')
                }
            }
        }
    },

}
