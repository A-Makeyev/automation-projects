// The same for all users
var password = env.password

const prodUser = 'qausr01@yes.co.il'
const prepUser = 'qausr01@yes.co.il.prep'
const qaUser = 'qausr01@yes.co.il.qaall'

const prodUrl = 'https://alphacrm.lightning.force.com'
const prepUrl = 'https://alphacrm--prep.my.salesforce.com'
const qaUrl = 'https://alphacrm--qaall.lightning.force.com'

// new password will always be old password + 1
function changePassword(url, user, oldPass) {
    let newPass = oldPass
    newPass = newPass.slice(2, newPass.length)
    newPass = parseInt(newPass) + 1
    newPass = String(newPass)
    newPass = 'Aa' + newPass

    web.open(url)
    web.waitForVisible('id=main')

    po.type('id=username', user)
    po.type('id=password', oldPass) 
    po.click('id=Login')

    if (web.isVisible('//div[contains(@class, "change-password")]')) {
        po.type('id=newpassword', newPass)
        po.type('id=confirmpassword', newPass)
        po.click('id=password-button')

        log.info(
            'Changed password at: ' + url + ' for user: ' + user 
            + '. New password is: ' + newPass + '. Make sure to update it in oxygen.env'
        )
    }
}

web.init()
web.setTimeout(10 * 1000)

changePassword(prodUrl, prodUser, password)
changePassword(prepUrl, prepUser, password)
changePassword(qaUrl, qaUser, password)
