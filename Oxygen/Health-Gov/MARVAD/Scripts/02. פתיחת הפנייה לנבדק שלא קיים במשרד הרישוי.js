const obj = po
const nav = obj.sub_nav
const utils = obj.utils
const func = obj.functions
const referrals = obj.referrals
const non_existent_ID = '999999999'

obj.init(env.url, 60)
startTime = func.getTime()

func.navigateToNewReferral()
obj.type(referrals.idInput, non_existent_ID)
func.pressTAB()


web.transaction('Assert Non Existent ID')
if (web.isVisible(utils.dialogWindow)) {
    if (func.getText(utils.dialogMessage).includes('מספר ת.ז. לא קיים ברשות הרישוי')) {
        obj.click(utils.dialogAccept)
    }
}


endTime = func.getTime()
log.info(
    'Test finished in: '
    + parseFloat((endTime - startTime) / 1000).toFixed(1)
    + ' seconds.'
)