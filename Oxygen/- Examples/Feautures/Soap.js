var msg_id = () => {
    var d = new Date().getTime()
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16
        if (d > 0) {
            r = (d + r)%16 | 0
            d = Math.floor(d/16)
        } else {
            r = (d2 + r)%16 | 0
            d2 = Math.floor(d2/16)
        }

        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
}

var data =  {
    "sGuid": "0X0XX00X0-XXXX-000-X0X0-XXX00X0X0XX0",
    "sXmlQ": `<![CDATA[<ROOTIN><HEADER><USER>cloudbeat</USER><MSGID>${msg_id()}</MSGID></ROOTIN>]]>`
}

var serviceUrl = 'http://0.000.00.0/user/mainservice.asmx?wsdl'
var serviceDescription = soap.describe(serviceUrl)
log.info(serviceDescription)

var result = soap.get(serviceUrl, 'ProcessXml', data)
var strXML = JSON.stringify(result)
var id = strXML.split('<F><N>DQ-ID</N>\r\n<V>')[0]
id = id.split('</V></F>')[1]
id = id.split('<V>')[1]
log.info('ID: ' + id)

var errCode = strXML.match(/<SYS_ERR_CODE>(.*?)<\/SYS_ERR_CODE>/g).map((v) => { return v.replace(/<\/?SYS_ERR_CODE>/g,'') })
log.info('SYS_ERR_CODE: ' +  errCode)

if (id == null || id == 'undefined' || errCode != '00000') {
    var errDesc = strXML.match(/<SYS_ERR_DESC>(.*?)<\/SYS_ERR_DESC>/g).map((v) => { return v.replace(/<\/?SYS_ERR_DESC>/g,'') })
    log.info('SYS_ERR_DESC: ' + errDesc)

    var applErrDesc = strXML.match(/<APPL_ERR_DESC>(.*?)<\/APPL_ERR_DESC>/g).map((v) => { return v.replace(/<\/?APPL_ERR_DESC>/g,'') })
    log.info('APPL_ERR_DESC: ' + applErrDesc)
}
