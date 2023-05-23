const PO = require('./PageObjects.js')

web.transaction("Initializing Selenium and opening the main page")
PO.INIT()

web.transaction("Enter the shop page and add an item to the cart")
web.click(PO.NAV.SHOP)
web.waitForExist(PO.SHOP.ENGLISH_TEXT)

web.click(PO.SHOP.BURKINA)
web.waitForExist(PO.SHOP.ITEM.CANTITATE)

web.select(PO.SHOP.ITEM.CANTITATE, 'value=50g')
web.pause(2000)
web.click(PO.SHOP.ITEM.PLUS)
web.pause(2000)
web.click(PO.SHOP.ITEM.ADD)

web.transaction("Enter the cart and assert that the item was placed")
web.click(PO.NAV.CART)
web.waitForExist('//a[contains(text(), "50g")]')
web.assertExist('//input[contains(@id, "quantity") and @value="2"]')

web.dispose('Passed')