var url = 'https://api.ship.co.il/api/v3/shipments/status?trackingNumber='
var trackingNumbers = [
    'XXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXX'
]

web.transaction('Fetch Tracking Data')
for (let x = 0; x < trackingNumbers.length; x++) {
    var status = http.get(url + trackingNumbers[x])
    log.info(status)
}

http.assertText('"Status":"נמסר"')
