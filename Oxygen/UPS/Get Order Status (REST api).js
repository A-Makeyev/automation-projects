var url = 'https://api.ship.co.il/api/v3/shipments/status?trackingNumber='
var trackingNumbers = [
    'W5544766124',
    'W5544765090',
    '1Z7713950497669989',
    '1Z7502360464517642',
    '1Z4937F70457779683'
]

web.transaction('Fetch Tracking Data')
for (let x = 0; x < trackingNumbers.length; x++) {
    var status = http.get(url + trackingNumbers[x])
    log.info(status)
}



// var status = http.get('https://api.ship.co.il/api/v3/shipments/status?trackingNumber=W5544766124')
// log.info(status)

// var test = http.get('https://jsonplaceholder.typicode.com/todos/1')
// log.info(test)


// web.init()
// web.execute(() => {
//     fetch('https://api.ship.co.il/api/v3/shipments/status?trackingNumber=W5544766124')
//         .then(res => res.json())
//         .then(json => console.log(json))
// })

// web.transaction('Init')
// web.init()
// const url = 'https://api.ship.co.il/api/v3/shipments/status?trackingNumber'

// web.transaction('Open Tracking Number: W5544766124')
// web.open(`${url}=W5544766124`)

// web.transaction('Assert Data')
// var data = web.getText('//pre')
  
// assert.contain(data, '<Status>נמסר</Status>') 
// assert.contain(data, '<Dispatch i:nil="true" />')
// assert.contain(data, '<LastSite>Haifa</LastSite>')
// assert.contain(data, '<LocalTime>12:44</LocalTime>')
// assert.contain(data, '<DeliveredOn>17/03/2021 12:44</DeliveredOn>')

// web.transaction('Open Tracking Number: W5544765090')
// web.open(`${url}=W5544765090`)

// web.transaction('Assert Data')
// data = web.getText('//pre')

// assert.contain(data, '<Status>נמסר</Status>')
// assert.contain(data, '<Dispatch i:nil="true" />')
// assert.contain(data, '<LastSite>Rishon leTsiyon leZion</LastSite>')
// assert.contain(data, '<LocalTime>10:42</LocalTime>')
// assert.contain(data, '<DeliveredOn>17/03/2021 10:42</DeliveredOn>')

// web.transaction('Open Tracking Number: 1Z7713950497669989')
// web.open(`${url}=1Z7713950497669989`)

// web.transaction('Assert Data')
// data = web.getText('//pre')

// assert.contain(data, '<Status>נמסר</Status>')
// assert.contain(data, '<Dispatch i:nil="true" />')
// assert.contain(data, '<LastSite>Caesarea Keisarya</LastSite>')
// assert.contain(data, '<LocalTime>21:39</LocalTime>')
// assert.contain(data, '<DeliveredOn>17/03/2021 11:04</DeliveredOn>')

// web.transaction('Open Tracking Number: 1Z7502360464517642')
// web.open(`${url}=1Z7502360464517642`)

// web.transaction('Assert Data')
// data = web.getText('//pre')

// assert.contain(data, '<Status>נמסר</Status>')
// assert.contain(data, '<Dispatch i:nil="true" />')
// assert.contain(data, '<LastSite>Caesarea Keisarya</LastSite>')
// assert.contain(data, '<LocalTime>10:40</LocalTime>')
// assert.contain(data, '<DeliveredOn>16/02/2021 10:40</DeliveredOn>')

// web.transaction('Open Tracking Number: 1Z4937F70457779683')
// web.open(`${url}=1Z4937F70457779683`)

// web.transaction('Assert Data')
// data = web.getText('//pre')

// assert.contain(data, '<Status>נמסר</Status>')
// assert.contain(data, '<Dispatch i:nil="true" />')
// assert.contain(data, '<LastSite>SALT LAKE CITY</LastSite>')
// assert.contain(data, '<LocalTime>17:58</LocalTime>')
// assert.contain(data, '<DeliveredOn>19/03/2021 09:33</DeliveredOn>')




// const trackingNumbers = [
//     'W5544766124',
//     'W5544765090',
//     '1Z7713950497669989',
//     '1Z7502360464517642',
//     '1Z4937F70457779683'
// ];

// for (let trackingNumber of trackingNumbers) {
//     http.transaction(`01. Get Shipment Status - ${trackingNumber}`);
    
    
//     http.transaction(`02. Assert Delivery Status - ${trackingNumber}`);
//     http.assertText('"Status":"נמסר"');
// }


// const BASE_API_URL = 'https://api.ship.co.il';

// http.transaction('01. Get Shipment Status - W5544766124');
// http.get(`${BASE_API_URL}/api/v3/shipments/status?trackingNumber=W5544766124`);

// http.transaction(`02. Assert Delivery Details - W5544766124`);
// http.assertText('"Status":"נמסר"');
// http.assertText('"Status":"נמסר"');
// http.assertText('"Status":"נמסר"');
// http.assertText('"Status":"נמסר"');
// http.assertText('"Status":"נמסר"');




// web.transaction('Assert Data')
// var data = web.getText('//pre')
  
// assert.contain(data, '<Status>נמסר</Status>') 
// assert.contain(data, '<Dispatch i:nil="true" />')
// assert.contain(data, '<LastSite>Haifa</LastSite>')
// assert.contain(data, '<LocalTime>12:44</LocalTime>')
// assert.contain(data, '<DeliveredOn>17/03/2021 12:44</DeliveredOn>')

// web.transaction('Open Tracking Number: W5544765090')
// web.open(`${url}=W5544765090`)

// web.transaction('Assert Data')
// data = web.getText('//pre')

// assert.contain(data, '<Status>נמסר</Status>')
// assert.contain(data, '<Dispatch i:nil="true" />')
// assert.contain(data, '<LastSite>Rishon leTsiyon leZion</LastSite>')
// assert.contain(data, '<LocalTime>10:42</LocalTime>')
// assert.contain(data, '<DeliveredOn>17/03/2021 10:42</DeliveredOn>')

// web.transaction('Open Tracking Number: 1Z7713950497669989')
// web.open(`${url}=1Z7713950497669989`)

// web.transaction('Assert Data')
// data = web.getText('//pre')

// assert.contain(data, '<Status>נמסר</Status>')
// assert.contain(data, '<Dispatch i:nil="true" />')
// assert.contain(data, '<LastSite>Caesarea Keisarya</LastSite>')
// assert.contain(data, '<LocalTime>21:39</LocalTime>')
// assert.contain(data, '<DeliveredOn>17/03/2021 11:04</DeliveredOn>')

// web.transaction('Open Tracking Number: 1Z7502360464517642')
// web.open(`${url}=1Z7502360464517642`)

// web.transaction('Assert Data')
// data = web.getText('//pre')

// assert.contain(data, '<Status>נמסר</Status>')
// assert.contain(data, '<Dispatch i:nil="true" />')
// assert.contain(data, '<LastSite>Caesarea Keisarya</LastSite>')
// assert.contain(data, '<LocalTime>10:40</LocalTime>')
// assert.contain(data, '<DeliveredOn>16/02/2021 10:40</DeliveredOn>')

// web.transaction('Open Tracking Number: 1Z4937F70457779683')
// web.open(`${url}=1Z4937F70457779683`)

// web.transaction('Assert Data')
// data = web.getText('//pre')

// assert.contain(data, '<Status>נמסר</Status>')
// assert.contain(data, '<Dispatch i:nil="true" />')
// assert.contain(data, '<LastSite>SALT LAKE CITY</LastSite>')
// assert.contain(data, '<LocalTime>17:58</LocalTime>')
// assert.contain(data, '<DeliveredOn>19/03/2021 09:33</DeliveredOn>')