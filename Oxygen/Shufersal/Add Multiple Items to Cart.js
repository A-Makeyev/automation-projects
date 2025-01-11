const productsToAdd = 10

web.transaction('01. Initialize')
web.init()
web.setTimeout(50 * 1000)
const shortWait = 2500

function closePopUp() {
    web.pause(shortWait)
    web.execute(() => {
        document.evaluate(
            '//div[@class="loginModalTop"]//button[@class="btnClose"]',
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue.click()
    })
    log.info('>>> Closed PopUp')
}

web.transaction('02. Open Main Page')
web.open('https://www.shufersal.co.il/')

web.transaction('03. Open Online Store')
web.click('//span[@class="textCategory" and contains(normalize-space(), "סופרמרקט")]')

web.transaction('04. Open Milk Products')
web.click('(//a[contains(normalize-space(), "מוצרי חלב וביצים")])[1]')

web.pause(shortWait)
web.execute(() => { window.scrollTo(0, document.body.scrollHeight) })

web.transaction('05. Add Products To Cart')
var productImg = '//ul[@id="mainProductGrid"]//img'
var cartProduct = '//section[@id="cartMiddleContent"]//img'
var addToCartBtn = '//ul[@id="mainProductGrid"]//button[contains(@class, "add-to-cart")]'

var cart = []
var price = ''
var totalProducts = 0
var popUpIsClosed = false
var visibleProducts = web.getElementCount(addToCartBtn)
log.info('Number of visible products: ' + visibleProducts)

for (let i = 1; i <= visibleProducts; i++) {
    if (!popUpIsClosed) { 
        web.clickHidden(`(${addToCartBtn})[${i}]`)
        popUpIsClosed = true
        closePopUp()
    }

    let productName = web.getAttribute(`(${productImg})[${i}]`, 'alt')
    web.clickHidden(`(${addToCartBtn})[${i}]`)
    closePopUp()

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

web.transaction('06. Remove All Products From Cart')
web.click('//a[@data-miglog-role="cart-remove-overlay-opener"]')
web.click('//button[@data-miglog-role="cart-remover"]')

if (web.isVisible('//*[contains(text(), "העגלה שלך ריקה")]')) {
    price = web.getText('//div[@class="price"]')
    totalProducts = web.getText('//span[@id="cartTotalItems"]')

    if (parseInt(totalProducts) === 0) {
        if (price.includes('0.00 ₪')) {
            log.info('✓ All products were removed successfully')
            assert.pass()
        }
    } else {
        assert.fail(
            'There was a problem with deleting the products,'
            + ' items left in cart: ' + totalProducts
        )
    }
}
