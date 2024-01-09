const user = 'XXXXX'
const pass = 'XXXXX'
const productsToAdd = 10

function removeAllProducts() {
    if (web.isVisible('//button[text()="לא תודה"]', shortWait * 2)) {
        web.clickHidden('//button[text()="לא תודה"]')
    } else if (web.isVisible('//*[contains(text(), "העגלה שלך ריקה")]', shortWait)) {
        log.info('העגלה ריקה')
    } else {
        web.click('//a[@data-miglog-role="cart-remove-overlay-opener"]')
        web.click('//button[@data-miglog-role="cart-remover"]')

        if (web.isVisible('(//div[@v-if="addressValidationResult"])[1]', shortWait)) {
            for (let x = 1; x <= 2; x++) {
                web.click(`(//button[contains(text(), "כן, בטל עדכון הזמנה")])[${x}]`)
                web.pause(shortWait / 2)
            }
        }

        if (web.isVisible('//*[contains(text(), "העגלה שלך ריקה")]', shortWait * 2)) {
            let totalProducts = web.getText('//span[@id="cartTotalItems"]')
            if (parseInt(totalProducts) === 0) {
                log.info('✓ All products were removed successfully')
            } else {
                assert.fail(
                    'There was a problem with deleting the products,'
                    + ' items left in cart: ' + totalProducts
                )
            }
        }
    }
}

web.transaction('01. Initialize')
web.init()
const shortWait = 5000

web.transaction('02. Open Main Page')
web.open('https://www.shufersal.co.il/')

web.transaction('03. Login')
web.click('//button[contains(normalize-space(), "התחברות")]')

web.type('//input[contains(@id, "username")]', user)
web.type('//input[contains(@id, "password")]', pass)
web.click('//button[contains(text(), "כניסה")]')

assert.equal(
    web.isVisible('//div[@class="loginInfoContainer"]//*[contains(text(), "בדיקות")]'), true,
    'There was a problem logging in with user: ' + user
)

web.transaction('04. Open Online Store')
web.click('//span[@class="textCategory" and contains(normalize-space(), "סופרמרקט")]')

web.transaction('05. Open Milk Products')
web.click('(//a[contains(normalize-space(), "מוצרי חלב וביצים")])[1]')

removeAllProducts()
web.execute(() => { window.scrollTo(0, document.body.scrollHeight) })

web.transaction('06. Add Products To Cart')
var productImg = '//ul[@id="mainProductGrid"]//img'
var cartProduct = '//section[@id="cartMiddleContent"]//img'
var addToCartBtn = '//ul[@id="mainProductGrid"]//button[contains(@class, "add-to-cart")]'

var cart = []
var price = ''
var totalProducts = 0

var visibleProducts = web.getElementCount(addToCartBtn)
log.info('Number of visible products: ' + visibleProducts)

for (let i = 1; i <= visibleProducts; i++) {
    let productName = web.getAttribute(`(${productImg})[${i}]`, 'alt')
    web.clickHidden(`(${addToCartBtn})[${i}]`)

    web.execute(() => {
        document.evaluate(
            '//div[@class="loginModalTop"]//button[@class="btnClose"]',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue.click()
    })

    // check if the product was added to cart
    web.waitForVisible(`//span[@id="cartTotalItems" and text()="${i}"]`)
    totalProducts = web.getText('//span[@id="cartTotalItems"]')

    if (parseInt(totalProducts) === i) {
        cart.push(productName)
    } else {
        log.warn(`${productName} was not added to cart`)
    }

    if (i === productsToAdd) {
        price = web.getText('//div[@class="price"]')
        log.info(`Products in cart: ${cart.length}, total price: ${price}`)
        log.info('Cart items:')
        log.info(cart)
        break
    }

}

web.transaction('07. Open Cart Summary')
web.click('//a[contains(@href, "cartsummary")]')
web.waitForVisible('//div[contains(@class, "cart-summary-prod")]')

web.transaction('08. Assert Cart Items')
var cartItems = '//div[contains(@class, "cart-summary-prod")]//*[contains(@class, "miglog-prod-name")]'
var cartItemsCount = web.getElementCount(cartItems)

if (cartItemsCount === productsToAdd) {
    for (let i = 1; i <= cartItemsCount; i++) {
        assert.equal(
            web.isVisible(`(${cartItems})[${i}]`), true,
            `Item ${`(${cartItems})[${i}]`} is not shown in cart summary`
        )
    }
} else {
    assert.fail(`Expected items in cart: ${productsToAdd}. Actual items: ${cartItemsCount}`)
}

web.transaction('09. Go To Checkout')
web.click('//button[contains(text(), "מעבר לקופה")]')

if (web.isVisible('//*[contains(text(), "הזנת סיסמה")]', shortWait)) {
    web.type('//input[contains(@id, "password")]', pass)
    web.click('//div[contains(@class, "confirmPassword")]//button[contains(text(), "אישור")]')
}

web.waitForVisible('//main[@class="orderSection"]')

web.transaction('10. Choose Delivery Date')
web.click('//*[contains(text(), "בחירת זמן למשלוח")]//..//..//a[@role="button"]')

var hoursElements = '//label[contains(@for, "hourInput")]//span[@class="radioText"]'
var hours = web.getElementCount(hoursElements)
var randomNumber = Math.floor((Math.random() * hours - 5) + 5)

web.pause(shortWait)
web.click(`(${hoursElements})[${randomNumber}]`)
web.pause(shortWait)

web.transaction('11. Confirm Order')
web.click('//section[@class="orderTotalSection"]//span[text()="אישור"]')

if (web.isVisible('//button[text()="המשך לתשלום"]', shortWait * 2)) {
    web.click('//button[text()="המשך לתשלום"]')
}

if (web.isVisible('//span[@class="error"]', shortWait)) {
    assert.fail(web.getText('//span[@class="error"]'))
}

if (web.isVisible('//section[@class="orderTotalSection"]', shortWait * 3)) {
    web.click('//section[@class="orderTotalSection"]//span[text()="אישור"]')
    if (web.isVisible('//section[@class="orderTotalSection"]', shortWait)) {
        web.execute(() => {
            document.evaluate(
                '//section[@class="orderTotalSection"]//span[text()="אישור"]',
                document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
            ).singleNodeValue.click()
        })
    }
}

web.waitForVisible('//div[@class="confirmDetails"]')

web.transaction('12. Open Update Order Page')
var orderNumber = web.getText('//span[contains(@class, "orderNumber")]')
orderNumber = String(orderNumber).match(/\d+/g)

if (orderNumber !== '') {
    log.info(`Order ${orderNumber} was created successfully`)
}

web.click(`//a[contains(@href, "my-account/personal-area/order/${orderNumber}/update")]`)
if (web.isVisible('//button[contains(text(), "עדכון סל")]')) {
    web.click('//button[contains(text(), "עדכון סל")]//..//..//..//..//button[@class="btnClose"]')
}

web.pause(shortWait)

if (web.isVisible(`//a[@id="cancel_${orderNumber}"]`)) {
    web.click(`//a[@id="cancel_${orderNumber}"]`)
} else {
    web.click('//a[contains(text(), "בדיקות עסקי אובליגו")]')
    web.click('//button[contains(text(), "רשימות והזמנות")]')
    web.click('//span[contains(text(), "הזמנות שלי באינטרנט")]')
    web.click(`//a[@href="/online/he/my-account/personal-area/order/${orderNumber}"]`)
    web.click(`//a[@id="cancel_${orderNumber}"]`)
}

var info = web.getText('//*[text()="ביטול הזמנה"]//..//..//*[@class="info"]')
if (!info.includes(orderNumber)) {
    assert.fail(`Order number (${orderNumber}) does not appear at delete confirm message`)
} 

web.transaction('13. Delete Order')
web.click('//button[contains(text(), "מאשר ביטול הזמנה")]')
web.waitForVisible(`//h3[contains(text(), "${orderNumber}")]`)

if (!web.isVisible('//div[contains(text(), "ההזמנה בוטלה")]')) {
    assert.fail(`Order ${orderNumber} was not deleted`)
} else {
    log.info(`Order ${orderNumber} was deleted successfully`)
}

web.transaction('14. Logout')
web.click('//aside[@id="cartContainer"]//a[text()="התנתקות"]')

if (!web.isVisible('//aside[@id="cartContainer"]//a[text()="התחברות"]')) {
    assert.fail(`There was a problem logging out for user: ${user}`)
} else {
    log.info(`User < ${user} > logged out successfully`)
    assert.pass()
}
