po.init('3. תצוגה תפריט תחתון')
const footer = po.footer

web.transaction('03. Assert Footer Content')
if (web.isVisible(footer.content)) {
    web.scrollToElement(footer.content)

    web.transaction('04. Assert Footer Logo Image')
    if (web.isVisible(footer.logoImage)) {
        let footerImgAlt = web.getAttribute(footer.logoImage, 'alt')
        let footerImgSrc = web.getAttribute(footer.logoImage, 'src')

        if (!footerImgAlt.includes('yes')) {
            po.log('warning', `Footer image alt is not set to "yes" at ${footer.logoImage}, actual alt: ${footerImgAlt}`)
        } else {
            po.log('success', `Footer image alt is valid -> ${footerImgAlt}`)
        }

        if (!footerImgSrc.includes('logo_yes.png')) {
            po.log('warning', `Footer image src is not valid at ${footer.logoImage}, actual src: ${footerImgSrc}`)
        } else {
            po.log('success', `Footer image src is valid -> ${footerImgSrc}`)
        }
    }

    web.transaction('05. Assert Footer Links')
    var footerLinksCount = web.getElementCount(footer.links)
    for (let x = 1; x <= footerLinksCount; x++) {
        let item = `(${footer.links})[${x}]`
        if (web.isVisible(item)) {
            let href = web.getAttribute(item, 'href')
            if (!!href.trim()) {
                po.log('success', `${x}. ${po.getText(item)}, href: ${href}`)
            } else {
                po.log('warning', `Footer link at ${item} is not valid`)
            }
        } 
    }

    web.transaction('06. Assert Footer Socials')
    var footerSocialLinksCount = web.getElementCount(footer.socialLinks)
    for (let x = 1; x <= footerSocialLinksCount; x++) {
        let img = `(${footer.socialImages})[${x}]`
        let link = `(${footer.socialLinks})[${x}]`
        if (web.isVisible(img) && web.isVisible(link)) {
            let alt = web.getAttribute(img, 'alt')
            let href = web.getAttribute(link, 'href')
            if (!!alt.trim() && !!href.trim()) {
                po.log('success', `${alt} -> ${href}`)
            } else {
                po.log('warning', `Social link at ${link} is not valid`)
            }
        } 
    }
} else {
    assert.fail(`Footer is not visible at ${footer.content}`)
}
