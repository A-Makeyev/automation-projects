/*
 * Sanity steps:
 * Create new project
 * Set an environment
 * Create a web case
 * Run the case
 * Assert the result
 * Delete the project
 */

// set to false if you want to keep the project
const deleteProject = true

const nav = po.nav
const utils = po.utils
const func = po.functions

const projectNumber = String(func.generateNumber())
const project = `* Test Project ~ ${projectNumber}`
const environment = `Environment ~ ${projectNumber}`
const webFolder = `Web Folder ~ ${projectNumber}`
const webCase = `Web Case ~ ${projectNumber}`

var startTime = func.getTime()
po.login(env.url, 25, env.username, env.password)

web.transaction('04. Create New Project')
web.click(nav.menuList('Projects'))
web.click(nav.menuItem('Projects', '1'))

web.click(utils.addProject)
web.type('id=new-proj-name', project)

web.click(utils.next)
web.click(utils.next)
web.click(utils.finish)

if (!web.isVisible(`//span[@class="nodeText" and @title="${project}"]`)) 
    assert.fail('There was a problem creating a project')

log.info(`Created ${project}`)

web.transaction('05. Create New Environment')
web.pause(po.shortWait)
web.click(nav.menuItem('Environments', '1'))

// choose the current project
web.click('//div[contains(@class, "project-row")]')
web.click(`//li[contains(@class, "project-item") and text()="${project}"]`)
web.click(utils.addEnvironment)

// create env
web.type('id=add_suite_form_str', environment)
web.click(utils.add)
web.pause(po.shortWait)

// add details
// url
web.click('//table[@class="table table-bordered"]//tr[1]/td[1]')
web.sendKeys('url')

web.click('//table[@class="table table-bordered"]//tr[1]/td[2]')
web.sendKeys(env.url)

// username
web.click('//table[@class="table table-bordered"]//tr[2]/td[1]')
web.sendKeys('username')

web.click('//table[@class="table table-bordered"]//tr[2]/td[2]')
web.sendKeys(env.username)

// password
web.click('//table[@class="table table-bordered"]//tr[3]/td[1]')
web.sendKeys('password')

web.click('//table[@class="table table-bordered"]//tr[3]/td[2]')
web.sendKeys(env.password)

web.click(utils.saveEnv)
web.waitForVisible('//span[@class="table-save-success-notify" and text()="Saved successfully!"]')

log.info(`Created ${environment}`)

web.transaction('06. Create New Case - Web')
web.pause(po.shortWait)
web.click(nav.menuItem('Cases', '1'))

// choose the current project
web.click('//div[contains(@class, "project-row")]')
web.click(`//li[contains(@class, "project-item") and text()="${project}"]`)

// create folder
web.click('//a[contains(text(), "new folder")]')
web.type('id=new_folder_form_str', webFolder)
web.click(utils.add)

// create case
web.click(`//span[text()="${webFolder}"]`)
web.click('//div[@class="info-box"]//a[contains(text(), "Web")]') 

web.type('id=add_suite_form_str', webCase)
web.click(utils.add) 

if (!web.getText('//h2[@class="ant-typography suites-and-cases__title"]').includes(webCase)) 
    assert.fail('There was a problem creating a case')

function initializeCase() {
    // choose browser
    func.chooseBrowser('Chrome', env.browser)

    // create script
    web.clickHidden('//div[text()="Script"]')
    web.click('//span[text()="Edit"]')
    web.click('//div[contains(@class, "view-lines")]')

    let loginScript =
    `
        web.transaction('Open Main Page')
        web.init()
        web.open(env.url)
        web.transaction('Log In')

        web.type('id=login_form_email', env.username)
        web.type('id=login_form_password', env.password)
        web.click('//button[@htmltype="submit"]')
        web.click('//a[text()="Demo1"]')
        
        web.transaction('Assert User')
        web.waitForVisible('//span[@class="ant-typography"]')
        var user = web.getText('//span[@class="ant-typography"]')
        if (!user.includes('${env.name == 'prod' ? 'Anatoly' : 'Roman'}')) assert.fail('Expected logged in user to be "Roman" instead got: ' + user)
        else assert.pass(user + ' logged in successfully')
    `
    let httpRequestScript = 
    `
        const url = 'https://jsonplaceholder.typicode.com/posts'
        const headers = { 'Content-type': 'application/json; charset=UTF-8' }

        web.transaction('GET Request')
        var getResponse = http.get(url, headers)
        http.assertStatusOk()
        http.assertStatus(200)
        http.assertHeader('Content-type', 'application/json; charset=UTF-8')

        var user = getResponse.body[0]
        assert.contain(String(user.userId), '1', 'Expected userId to be 1, instead got: ' + user.userId)

        log.info('First User:')
        log.info(user)
        log.info('*'.repeat(50))

        const data = { title: 'foo', body: 'bar', userId: getResponse.body.length + 1 }

        web.transaction('POST Request')
        var postResponse = http.post(url, data, headers)
        http.assertStatus(201)
        http.assertHeader('Content-type', 'application/json; charset=UTF-8')

        var newUser = postResponse.body
        assert.contain(String(newUser.userId), '101', 'Expected new userId to be 101, instead got: ' + newUser.userId)

        log.info('New User:')
        log.info(newUser)
        log.info('*'.repeat(50))

        web.transaction('PUT Request')
        var putResponse = http.put(url + '/1', data, headers)
        http.assertStatus(200)
        var updatedUser = putResponse.body
        assert.contain(updatedUser.title, 'foo', 'Expected updated title to be foo, instead got: ' + updatedUser.title)
        assert.contain(updatedUser.body, 'bar', 'Expected updated body to be bar, instead got: ' + updatedUser.body)

        log.info('Updated First User:')
        log.info(updatedUser)
        log.info('*'.repeat(50))

        web.transaction('PATCH Request')
        const patchData = { title: 'patched' }
        var patchResponse = http.patch(url + '/1', patchData, headers)
        http.assertStatus(200)
        var patchedUser = patchResponse.body
        assert.contain(patchedUser.title, 'patched', 'Expected patched title to be patched, instead got: ' + patchedUser.title)

        log.info('Patched User:')
        log.info(patchedUser)
        log.info('*'.repeat(50))

        web.transaction('DELETE Request')
        var deleteResponse = http.delete(url + '/1')
        http.assertStatus(200)
        var deletedUser = deleteResponse.body

        if (!Object.keys(deletedUser).length === 0) assert.fail('DELETE Request to ' + url + '/1 Failed')

        log.info('Deleted First User:')
        log.info(deletedUser)
        assert.pass()
    `

    web.sendKeys(loginScript)
    web.sendKeys(httpRequestScript)

    // configure environment
    web.clickHidden('//div[text()="Settings"]') 
    web.click('//span[text()="Environments"]//..//input[@class="ant-select-selection-search-input"]')
    web.click(`//*[@class="ant-select-item-option-content" and contains(text(), "${environment}")]`)

    // details
    web.clickHidden('//div[text()="Details"]')
    web.type('id=notes', 'Details about the case')

    // save
    web.click(utils.saveChanges)
    log.info(`Created ${webCase}`)
}
initializeCase()

if (web.isVisible('//div[contains(@class, "network_fetch_errors")]', po.shortWait)) {
    log.info(web.getText('//div[contains(@class, "network_fetch_errors")]'))
    web.click('//span[contains(text(), "Reload")]')
    initializeCase()
}

web.transaction('07. Run The Web Case')
web.click(utils.run)
log.info(`Running ${webCase}`)

log.info('*************************')
log.info('* Test Inside CloudBeat *')
log.info('*************************')


// if (web.isVisible('//div[@class="value initializing"]')) {
//     log.info(`*      ${web.getText('//div[@class="value initializing"]')}     *`)
//     log.info('*************************')
// }
    
// if (web.isVisible('//div[@class="value running"]')) {
//     log.info(`*        ${web.getText('//div[@class="value running"]')}        *`)
// }

// if (web.isVisible('//div[@class="value pending"]')) {
//     if (web.isVisible('//div[@class="value pending"]')) {
//         log.info(`*        ${web.getText('//div[@class="value pending"]')}        *`)
//         log.info('*************************')
//         log.info(`The case is stuck at pending for over ${web.getText('//span[text()="Duration"]//..//div[@class="value"]')}`)
//     }
// }
    
// if (web.isVisible('//td[text()="No data"]')) {
//     web.refresh()
//     if (web.isVisible('//td[text()="No data"]')) {
//         log.info(`*        ${web.getText('//td[text()="No data"]')}        *`)
//         log.info('The case failed to execute')
//         log.info('*************************')
//     }
// }

if (web.isVisible('(//span[contains(@class,"ui-label")])[1]') && web.isVisible(utils.run)) {
    var status = web.getText('(//span[contains(@class,"ui-label")])[1]')
}

if (status == 'PASSED') {
    log.info('*      Test Passed      *')
    log.info('*************************')
} else if (status == 'FAILED') {
    log.info('*      Test Failed      *')
    log.info('*************************')
} else {
    log.info('There was a problem running the script')
}

if (web.isVisible('//button[contains(@class, "btn-danger")]', po.shortWait)) 
    web.click('//button[contains(@class, "btn-danger")]')

/* todo: check defined variables */

if (deleteProject) {
    web.transaction('08. Delete Project')
    func.deleteProject(project)
}

web.dispose('Passed')
var endTime = func.getTime()
log.info(`Sanity test finished in ${(parseFloat(endTime - startTime) / 1000).toFixed(1)} seconds`)
