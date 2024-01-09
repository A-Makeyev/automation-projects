// cli run
// cloudbeat-cli start case 14057 --apiKey XXX-XXX-XXX-XXX-XXXX --apiBaseUrl https://api.cloudbeat.io --env testEnv --tags url=https://www.my-picture.ae,version=v1-beta

web.transaction('01 Init')
web.init()
web.setTimeout(120 * 1000)

const version = attributes ? attributes.version : env.version
const version = attributes ? attributes.url : env.url

const path = require('path')
const folder = path.join(__dirname, './Data')
const filePath =  folder + '\\image.jpg'
const couponCode = '100pica.nova100'

// block certain domains
if (ctx.caps.browserName === 'chrome') {
    web.network.init()
    web.network && web.network.blockUrls && web.network.blockUrls([
        '*google.com',
        '*veinteractive.com'
    ])
}

web.transaction('02 Homepage')
web.open(`${url}/${version}`)

web.transaction('03 Upload File')
web.fileBrowse('//input[contains(@id, "uploadIdCms")]', filePath)
web.waitForVisible('link=Continue to Shopping Cart')

web.transaction('04 Continue to Shopping Cart')
web.scrollToElement('//a[contains(text(), "Continue to Shopping Cart")]', true)
web.click('//a[contains(text(), "Continue to Shopping Cart")]')
web.waitForVisible('id=shoppingcartForm:couponCode')

web.transaction('05 Apply Coupon')
web.type('id=shoppingcartForm:couponCode', couponCode)
web.click('id=shoppingcartForm:applyCoupon')
web.waitForVisible(`//ul[@id="shoppingcartForm:messageTop"]//li[@class="-info" and contains(text(), "${couponCode}")]`)
web.waitForVisible('id=shoppingcartForm:proceedToCheckout')

web.transaction('06 Secure Checkout')
web.click('id=shoppingcartForm:proceedToCheckout')
web.waitForVisible('//a[contains(text(), "Continue to checkout")]')

web.transaction('07 Order as guest - Continue to checkout')
web.click('//a[contains(text(), "Continue to checkout")]')

web.transaction('08 Address form - Fill out')
web.type('id=addressesForm:invoiceEmail', 'test@example.com')
web.type('id=addressesForm:invoiceForename', 'Test')
web.type('id=addressesForm:invoiceSurname', 'Test')
web.type('id=addressesForm:invoiceStreet', '802 Dundas St')
web.type('id=addressesForm:invoiceZipCode', 'N6B 3L5')
web.type('id=addressesForm:invoiceCity', 'London')

web.click('//div[@id="addressesForm:invoiceRegionDropdown"]//button')
web.click('//div[@id="addressesForm:invoiceRegionDropdown"]//li[@data-value="Alberta"]')
 
web.transaction('09 Address form - Continue')
web.click('//div[@class="continue"]//button')

web.transaction('10 Payment Method - Continue')
web.click('//div[@id="paymentMethod:proceed"]//button')

web.transaction('11 Confirmation - Buy Now')
web.click('id=orderConfirmationForm:buyNowButton')

assert.equal(
    web.isVisible(`//*[contains(text(), "Thank you very much, Test!")]`), true,
    'Failed to make an order!'
)
