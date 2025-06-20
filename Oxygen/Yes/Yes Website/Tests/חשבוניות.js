po.loginPage.login()

web.transaction('Open Invoices')
if (web.isVisible(po.accountPage.invoicesNotFound)) {
    log.info(`לא מצאנו חשבוניות בחשבון ${env.userPhone}`)
}

web.pause(1)