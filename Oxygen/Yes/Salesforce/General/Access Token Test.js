const client_id = '3MVG954MqIw6FnnPdRJ8vKy.OE6tMZ2MEKmNq1IvzE__vq3kLhNlESV2rD5M9ldwi_XYfPXN0DWSsY7UOrU6z'
const client_secret = '6BA525CB250CFF222FAEFAA1965A83D2214869AA3A2B6052AE781585B35BE433'
const SA_ID = '08p8E000000VpBZQA0'

var tokenRequestUrl = 'https://test.salesforce.com/services/oauth2/token'

var tokenRequestData = 'grant_type=password'
                     + '&client_id=' + env.client_id
                     + '&client_secret=' + env.client_secret
                     + '&username=nikita.maslovski@asperii.com.ci3'
                     + '&password=Ozik2020SIFQJtSFgpB8CQ1K0s6OYY2sa'

var tokenRequestHeaders = {
   'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
}

var tokenRes = http.post(tokenRequestUrl, tokenRequestData, tokenRequestHeaders)
log.info(tokenRes.body)

if (tokenRes.statusCode == 200) {
    var access_token = tokenRes.body.access_token
} else {
    assert.fail(`POST request to ${tokenUrl} has failed with status: ${tokenRes.statusCode}`)
}

log.info('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')

var url = 'https://alphacrm--ci3.my.salesforce.com/services/apexrest/RunDerivationSF'

 var data = {
     'ServiceId': SA_ID
 }

 var headers = {
    'Content-Type': 'application/json;',
     'Accept': 'application/json',
     'Authorization': 'Bearer ' + access_token
 }

 var res = http.post(url, data, headers)
 log.info(res.body)

if (res.statusCode != 200) {
    assert.fail(`POST request to ${url} has failed with status: ${res.statusCode}`)
} else if (res.body.success != true) {
    assert.fail(`POST request to ${url} expected 'success' to be true, instead got: ${res.body.success}`)
}
