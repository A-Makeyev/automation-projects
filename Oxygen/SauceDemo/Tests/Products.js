web.transaction('01. Initialize Webdriver')
web.init()

web.transaction(`02. Open ${env.baseURL}`)
web.open(env.baseURL)

web.transaction(`03. Login With ${env.standardUser}`)
po.LoginPage.enterUsername(env.standardUser)
po.LoginPage.enterPassword(env.password)
po.LoginPage.pressLoginButton()
po.LoginPage.assertLoginSuccess()

web.transaction('04. Assert Products Count')
po.ProductsPage.assertProductsCount(6)

web.transaction('05. Add Products To Cart')
po.ProductsPage.clickAddToCartButton(1)
po.ProductsPage.assertPriceBarButtonText(1, 'Remove')

web.transaction('06. Remove Products To Cart')
po.ProductsPage.clickRemoveButton(1)
po.ProductsPage.assertPriceBarButtonText(1, 'Add to cart')
