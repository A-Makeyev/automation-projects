web.transaction('01. Initialize Webdriver')
web.init()

web.transaction(`02. Open ${env.baseURL}`)
web.open(env.baseURL)

web.transaction(`03. Login With ${env.standardUser}`)
po.LoginPage.enterUsername(env.standardUser)
po.LoginPage.enterPassword(env.password)
po.LoginPage.pressLoginButton()
po.LoginPage.assertLoginSuccess()
web.back()

web.transaction(`04. Login With ${env.lockedUser}`)
po.LoginPage.enterUsername(env.lockedUser)
po.LoginPage.enterPassword(env.password)
po.LoginPage.pressLoginButton()
po.LoginPage.assertLoginErrorMessage('Epic sadface: Sorry, this user has been locked out.')

web.transaction(`05. Login With ${env.invalidUser}`)
po.LoginPage.enterUsername(env.invalidUser)
po.LoginPage.enterPassword(env.password)
po.LoginPage.pressLoginButton()
po.LoginPage.assertLoginErrorMessage('Epic sadface: Username and password do not match any user in this service')
