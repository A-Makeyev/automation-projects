module.exports = {

    utils: {
        shortWait: 5000,
        waitASecond: 1000,
        longWait: 10 * 1000,

        getAppSource: () => {
            require('fs').writeFileSync(
                `${require('os').userInfo().homedir}\\Desktop\\src.txt`, mob.getSource()
            )
        },

        click: (el) => {
            mob.pause(po.utils.waitASecond)
            mob.findElement(el).click()
        },
    },

    loginScreen: {
        headingText: '//android.view.View[@text="התחברות"]',
        continueAsGuestButton: '//android.widget.TextView[@text="היכנסו כאורח"]',
        continueButton: '//android.widget.Button[contains(@content-desc, "להמשך")]',

        chooseEnv: (str) => {
            if (mob.isVisible('//android.widget.TextView[contains(@text, "Choose environment")]', po.utils.longWait)) {
                mob.click(`//android.view.ViewGroup[contains(@content-desc, "בחירה ${str}")]/android.view.ViewGroup`)
                mob.click('//android.widget.Button//android.widget.TextView[contains(@text, "GO")]')
            }
        },

        enterNumber: (str) => {
            let arr = str.split('')
            for (let x = 0; x < arr.length; x++) {
                mob.click(`//android.widget.TextView[@text="${str[x]}"]`)
                mob.pause(po.utils.waitASecond)
            }
        },

    }

}
