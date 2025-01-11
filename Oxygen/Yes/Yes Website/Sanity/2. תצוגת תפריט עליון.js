po.init('2. תצוגת תפריט עליון')

web.transaction('03. Assert Top Nav Content Menu')
web.point('//header//a[contains(text(), "עולם התוכן")]')
var menuElements = '//header//a[contains(text(), "עולם התוכן")]//..//a'
var menuElementsCount = web.getElementCount(menuElements)
po.log('info', 'עולם התוכן')
for (let x = 1; x <= menuElementsCount; x++) {
    let item = `(${menuElements})[${x}]`
    let href = web.getAttribute(`(${menuElements})[${x}]`, 'href')
    if (web.isVisible(item) && !!href.trim()) {
        po.log('success', `${x}. ${po.getText(item)}, ${href}`)
    } else {
        po.log('warning', `Menu item at ${item} is not valid`)
    }
}

web.transaction('04. Assert Top Nav Products And Discounts Menu')
web.point('//header//a[contains(text(), "מבצעים ומוצרים")]')
var menuElements = '//header//a[contains(text(), "מבצעים ומוצרים")]//..//a'
var menuElementsCount = web.getElementCount(menuElements)
po.log('info', 'מבצעים ומוצרים')
for (let x = 1; x <= menuElementsCount; x++) {
    let item = `(${menuElements})[${x}]`
    let href = web.getAttribute(`(${menuElements})[${x}]`, 'href')
    if (web.isVisible(item) && !!href.trim()) {
        po.log('success', `${x}. ${po.getText(item)}, ${href}`)
    } else {
        po.log('warning', `Menu item at ${item} is not valid`)
    }
}

web.transaction('04. Assert Top Nav Service Menu')
web.point('//header//a[contains(text(), "שירות ותמיכה")]')
var menuElements = '//header//a[contains(text(), "שירות ותמיכה")]//..//a'
var menuElementsCount = web.getElementCount(menuElements)
po.log('info', 'שירות ותמיכה')
for (let x = 1; x <= menuElementsCount; x++) {
    let item = `(${menuElements})[${x}]`
    let href = web.getAttribute(`(${menuElements})[${x}]`, 'href')
    if (web.isVisible(item) && !!href.trim()) {
        po.log('success', `${x}. ${po.getText(item)}, ${href}`)
    } else {
        po.log('warning', `Menu item at ${item} is not valid`)
    }
}
