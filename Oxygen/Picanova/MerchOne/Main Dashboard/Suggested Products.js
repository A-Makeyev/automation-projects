const auth = require('../Pages/Auth.js')
const dashboard = require('../Pages/Dashboard.js')

web.transaction(`Open ${env.dashboardUrl}`)
po.init(env.dashboardUrl)

web.transaction('Assert Login Page Is Displayed')
if (web.isVisible(auth.authLayout)) {
    po.passedTests.push('Login page is displayed')
} else {
    po.errors.push('Failed to load login page')
}

web.transaction(`Login With -> ${env.email}`)
po.login(env.email, env.password)
po.assertUserLoggedIn(env.email)

web.transaction('Get Current User\'s First Name')
const dashboardHeader = web.getText(dashboard.welcomeHeader)
const userFirstName = po.getUserName()[0]

web.transaction(`Validate That "Welcome ${userFirstName}!" Is Present`)
if (dashboardHeader.includes(userFirstName)) {
    po.passedTests.push(`Dashboard header: ${dashboardHeader}`)
} else {
    po.errors.push(`Dashboard header doesn't include the user's name (${userFirstName})`)
}

web.transaction('Validate That "Suggested Products" Section Is Displayed')
if (web.isVisible(dashboard.suggestedProductsSection)) {
    po.passedTests.push('Suggested Products Section Is Displayed')
} else {
    po.errors.push('Suggested Products Section Is NOT Displayed')
}

web.transaction('Open Suggested Products Page')
web.isVisible(dashboard.seeAllSuggestedProductsButton) && po.click(dashboard.seeAllSuggestedProductsButton)

if (web.isVisible(dashboard.costumPrintedProductsGrid)) {
    const products = web.getElementCount(dashboard.costumPrintedProducts)
    po.passedTests.push(`Suggested Products (${products}) Page Is Displayed`)
} else {
    po.errors.push('Suggested Products Page Is NOT Displayed')
}

web.transaction('Open Dashboard Page')
po.click(dashboard.backButton)

if (web.isVisible(dashboard.dashboardContent)) {
    po.passedTests.push('Dashboard Page Is Displayed After Clicking On Back Button')
} else {
    po.errors.push('Dashboard Page Is NOT Displayed After Clicking On Back Button')
}

web.transaction('Open First Product In Suggested Products Section')
if (web.isVisible(dashboard.suggestedProductsSection)) {
    var firstProduct = po.getText(dashboard.firstProductInSuggestedProductsSection)
    var firstProductLink = web.getAttribute(dashboard.firstProductInSuggestedProductsSection, 'href')
    firstProductLink = firstProductLink.split('.com')[1]

    web.open(env.url + firstProductLink)

    if (web.isVisible(dashboard.productItem)) {
        const openedProduct = po.getText(dashboard.productItemName)
        const productItemPrice = po.getText(dashboard.productItemPrice)
        const productItemShipping = po.getText(dashboard.productItemShipping)
        const productItemDescription = po.getText(dashboard.productItemDescription)

        if (firstProduct.split(' ')[0].includes(openedProduct.split(' ')[0])) {
            productItemPrice !== '' ? po.log('success', productItemDescription) : po.errors.push(`Product ${openedProduct} Price Is Empty`)
            productItemShipping !== '' ? po.log('success', productItemDescription) : po.errors.push(`Product ${openedProduct} Shipping Is Empty`)
            productItemDescription !== '' ? po.log('success', productItemDescription) : po.errors.push(`Product ${openedProduct} Description Is Empty`)
            po.passedTests.push(`Opened ${firstProduct} Product Page`)
        } else {
            po.errors.push(`Opened Product Page (${openedProduct}) Name Doesn't Match Suggested Product Name (${firstProduct})`)
        }
    } else {
        po.errors.push(`Product ${firstProduct} Page Did Not Open`)
    }
} 

web.transaction(`Open Back Dashboard Page From "${firstProduct}" Product Page`)
web.back()

if (web.isVisible(dashboard.dashboardContent)) {
    po.passedTests.push(`Dashboard Page Is Displayed After Going Back From "${firstProduct}" Product Page`)
} else {
    po.errors.push(`Dashboard Page Is NOT Displayed After Going Back From "${firstProduct}" Product Page`)
}

web.transaction('Assert That Suggested Products List Moves When Clicking On The Prev Button')
const suggestedProductsSwiperStyleBeforePrev = web.getAttribute(dashboard.suggestedProductsSwiper, 'style')
po.log('info', `Suggested Products Swiper Style Before Prev: ${suggestedProductsSwiperStyleBeforePrev}`)

po.click(dashboard.suggestedProductsSwipePrevButton)

const suggestedProductsSwiperStyleAfterPrev = web.getAttribute(dashboard.suggestedProductsSwiper, 'style')
po.log('info', `Suggested Products Swiper Style After Clicking Prev: ${suggestedProductsSwiperStyleAfterPrev}`)

if (suggestedProductsSwiperStyleBeforePrev !== suggestedProductsSwiperStyleAfterPrev) {
    po.passedTests.push('Suggested Products Swiper Style Changed After Clicking On The Prev Button')
} else {
    po.errors.push('Suggested Products Swiper Style Did NOT Change After Clicking On The Prev Button')
}

web.transaction('Assert That Suggested Products List Moves When Clicking On The Next Button')
const suggestedProductsSwiperStyleBeforeNext = web.getAttribute(dashboard.suggestedProductsSwiper, 'style')
po.log('info', `Suggested Products Swiper Style Before Next: ${suggestedProductsSwiperStyleBeforeNext}`)

po.click(dashboard.suggestedProductsSwipeNextButton)

const suggestedProductsSwiperStyleAfterNext = web.getAttribute(dashboard.suggestedProductsSwiper, 'style')
po.log('info', `Suggested Products Swiper Style After Clicking Next: ${suggestedProductsSwiperStyleAfterNext}`)

if (suggestedProductsSwiperStyleBeforeNext !== suggestedProductsSwiperStyleAfterNext) {
    po.passedTests.push('Suggested Products Swiper Style Changed After Clicking On The Next Button')
} else {
    po.errors.push('Suggested Products Swiper Style Did NOT Change After Clicking On The Next Button')
}

web.transaction('Display Results')
po.displayResults()
