po.init('1. כניסה ללקוחות רשומים')
const loginWindow = po.mainPage.loginWindow

web.transaction('03. Open Login Window')
po.click(po.mainPage.signInButton)

web.transaction(`04. Login With ${env.username}`)
po.loginWithExistingCustomer()

web.transaction('04. Assert Membership Page')
web.setTimeout(120 * 1000)
web.assertTextPresent('פרטי המנוי')    
assert.equal(
    web.isVisible('//div[@class="MembershipDetails"]'), true,
    'Membership details section is not visible'
)

var redirectedUrl = web.getUrl()
if (redirectedUrl != `${env.url}/self-service/accountdetailes/programs`) {
    po.log('error', `Expected redirected url after login to be: ${env.url}/self-service/accountdetailes/programs, instead got: ${redirectedUrl}`)
} else {
    po.log('success', `Redirected url after login -> ${redirectedUrl}`)
}

web.transaction('05. Assert Account Details')
var membershipName = web.getText('//div[contains(text(), "שם המנוי")]//..//div[@class="info"]')
!!membershipName.trim() ? po.log('success', `Membership Name: ${membershipName}`) : po.log('error', 'Membership Name is empty')

var membershipNumber = web.getText('//div[contains(text(), "מספר לקוח")]//..//div[@class="info"]')
!!membershipNumber.trim() ? po.log('success', `Membership Number: ${membershipNumber}`) : po.log('error', 'Membership Number is empty')

var mainPromotion = web.getText('//div[contains(text(), "מבצע ראשי")]//..//div[@class="info"]')
!!mainPromotion.trim() ? po.log('success', `Main Promotion: ${mainPromotion}`) : po.log('warning', 'Main Promotion is empty')

var promotionExpiration = web.getText('//div[contains(text(), "תוקף המבצע")]//..//div[@class="info"]')
!!membershipName.trim() ? po.log('success', `Promotion Expiration: ${promotionExpiration}`) : po.log('warning', 'Promotion Expiration is empty')
