const products = [
    'france',
    'burkina-faso',
    'discovery-pack',
    'adventurer-pack'
]

web.init();
web.open('https://spinoa.ro/en');
web.setTimeout(10000);

// Go to SHOP
web.execute(() => {
    document.getElementsByClassName('menu-item-link js-smooth-scroll')[0].click();
});

web.waitForExist('//h1[contains(text(), "New product range")]');
web.click(`//div[contains(@class, "shop-product")]//a[contains(@href, "${products[1]}")]`);
web.waitForExist('//h2[@class="page-title "]');

var burkinaPageTitle = web.getText('//h2[@class="page-title "]');
var burkinaProductTitle = web.getText('//h1[@class="product_title entry-title"]');
log.info('Product title: ' + burkinaPageTitle);

if (burkinaPageTitle == 'SPIRULINA CRUNCHIES BURKINA FASO') {
    if (burkinaProductTitle == 'Spirulina Crunchies Burkina Faso') {
        web.select('//select[@id="cantitate"]', 'label=50g');
    }
} else {
    assert.fail('Page title does not match the product');
}

web.pause(2500);
web.waitForExist('//div[@class="woocommerce-variation-price"]//span[contains(text(), "30,00")]');
var price = web.getText('//div[@class="woocommerce-variation-price"]//span[contains(text(), "30,00")]');
price = price.replace(',00lei', '');
log.info('Price: ' + price);

if (web.isExist('//p[@class="stock in-stock"]')) {
    for(let x = 0; x <= 3; x++) {
        web.click('//input[@value="+"]');
        web.pause(500);
    }
} else {
    assert.fail(products[1] + ' is out of stock');
}

var itemCount = web.getValue('//input[contains(@id, "quantity")]');
log.info('Item count: ' + itemCount);

web.click('//button[contains(@class, "single_add_to_cart_button")]');
web.pause(2500);

var itemsInCart = web.getText('//div[@class="shopping-cart-header add-header-height"]//span[@class="mk-header-cart-count"]');
log.info('Items in cart: ' + itemsInCart);

itemCount != itemsInCart ? assert.fail('The currect number was not added to the cart')
: web.click('//div[@class="shopping-cart-header add-header-height"]/a');

web.waitForExist('//h1[@class="page-title " and text()="Cart"]');

var finalPrice = web.getText('//td[@class="product-subtotal"]/span').replace(/,00lei/g, '');
log.info('Final price: ' + finalPrice);

if ((Number(price) * itemCount) != finalPrice) {
    assert.fail(`Final price doesn't match ${price * itemCount} lei`);
} else {
    web.click('//a[contains(text(), "Spirulina Crunchies Burkina Faso - 50g")]//..//..//a[@aria-label="Remove this item"]');
}

web.waitForExist('//p[@class="cart-empty woocommerce-info"]');

if (!web.getText('//p[@class="cart-empty woocommerce-info"]').includes('Your cart is currently empty')) {
    assert.fail('The cart is not empty after the deletion');
} else {
    web.click('//p[@class="return-to-shop"]/a');
}

web.waitForExist('//h1[contains(text(), "New product range")]');
itemsInCart = web.getText('//div[@class="shopping-cart-header add-header-height"]//span[@class="mk-header-cart-count"]');

if (itemsInCart != '0') {
    assert.fail('The items were not deleted');
} else {
    web.dispose('Passed');
}