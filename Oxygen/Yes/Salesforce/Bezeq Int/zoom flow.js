web.transaction('01. Init')
web.init()

web.transaction('02. Open')
var url = 'https://alphacrm--ci3.my.salesforce.com'
web.open(url)

web.transaction('03. Login')
po.type('id=username', 'iadmin@yes.co.il.ci3')
po.type('id=password', 'Internal11')
po.click('id=Login')

web.transaction('04. Open Pakas')
web.clickHidden('//*[@data-id="ServiceAppointment"]/a')
po.click('(//a[@data-refid="recordId"])[1]')

var SAid = web.getAttribute('(//a[@data-refid="recordId"])[1]', 'data-recordid')
log.info('SA id: ' + SAid)

var data = {
    "serviceId": `"${SAid}"`
}

var headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer bmlraXRhLm1hc2xvdnNraUBhc3BlcmlpLmNvbS5jaTM6T3ppazIwMjA="
}

var res = http.post(`${url}/services/apexrest/RunDerivationSF`, data, headers)
log.info(res)

web.pause(999)
