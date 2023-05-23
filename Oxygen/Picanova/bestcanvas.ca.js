web.transaction('01 Init')
web.init()
web.setTimeout(60 * 1000)
web.setWindowSize(1700, 1300)

const path = require('path')
const folder = path.join(__dirname, './Data')
const filePath =  folder + '\\image.jpg'
const couponCode = '100pica.nova100'

// block certain domains
if (ctx.caps.browserName === 'chrome') {
    web.network && web.network.blockUrls && web.network.blockUrls([
        '*google.com',
        '*veinteractive.com'
    ])
}

web.transaction('02 Homepage')
web.open('https://www.bestcanvas.ca/')

web.transaction('03 Upload File')
web.fileBrowse('//input[contains(@id, "uploadIdCms")]', image)
web.waitForVisible('link=Continue to Shopping Cart')

web.transaction('04 Continue to Shopping Cart')
web.scrollToElement('id=itemConfiguratorForm:j_id_cj', true)
web.click('id=itemConfiguratorForm:j_id_cj')
web.waitForVisible('id=shoppingcartForm:couponCode')

web.transaction('05 Apply Coupon')
web.type('id=shoppingcartForm:couponCode', couponCode)
web.click('id=shoppingcartForm:applyCoupon')
web.waitForVisible(`//ul[@id="shoppingcartForm:messageTop"]//li[@class="-info' and contains(text(), '${couponCode}")]`)
web.waitForVisible('id=shoppingcartForm:proceedToCheckout')

web.transaction('06 Secure Checkout')
web.click('id=shoppingcartForm:proceedToCheckout', 120 * 1000)
web.waitForVisible('//a[contains(text(), "Continue to checkout")]')

web.transaction('07 Order as guest - Continue to checkout')
web.click('//a[contains(text(), "Continue to checkout")]')

web.transaction('08 Address form - Fill out')
web.type('id=addressesForm:invoiceEmail', 'test@example.com')
web.type('id=addressesForm:invoiceForename', 'Test')
web.type('id=addressesForm:invoiceSurname', 'Test')
web.type('id=addressesForm:invoiceStreet', 'Teststr. 1')
web.type('id=addressesForm:invoiceZipCode', '11111')
web.type('id=addressesForm:invoiceCity', 'TEST')

web.click('//div[@id='addressesForm:invoiceRegionDropdown']//button')
web.click('//div[@id="addressesForm:invoiceRegionDropdown"]//li[@data-value="Alberta"]')
 
web.transaction('09 Address form - Continue')
web.click('//div[@class="continue"]//button')

// Payment Method - Continue button
// web.transaction('10 Payment Method - Continue')
// web.click('//button[@id="checkoutForm:j_id_84_2_2"]//span')

// web.transaction('11 Confirmation - Buy Now')
// // Confirmation - Buy Now button
// web.click('id=checkoutForm:buyNowButton')
// web.assertTextPresent('Thank you for your order!', 60000)
