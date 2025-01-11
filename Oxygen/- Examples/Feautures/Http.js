// add http module in oxygen.conf.js
// module.exports = {
//     modules: ['web', 'log', 'http', 'db']
// }


http.setOptions({
    timeout: {
        lookup: 1000,
        connect: 2 * 1000,
        secureConnect: 2 * 1000,
        socket: 100000,
        send: 100000,
        response: 1 * 60 * 1000
    },
})


/* With Auth */

var username = 'xxxxxxxx'
var password = 'xxxxxxxx'
var encodedCredentials = Buffer.from(username + ':' + password).toString('base64')

var baseURL = 'https://jsonplaceholder.typicode.com/'
var posts = `${baseURL}/posts`

var headers = {
    "Authorization": `Basic ${encodedCredentials}`,
	"Content-type": "application/json; charset=UTF-8"
}

var data = {
    title: "foo",
    body: "bar",
    userId: 1,
}



////////////////////////////////////////////////////////////////////////////



/* GET */
var response = http.get(posts)
var body = response.body
var userId = response.body.userId
log.info(body)
log.info('*'.repeat(100))

/* POST */
response = http.post(posts, data, headers)
body = response.body
log.info(response)
log.info('*'.repeat(100))

/* PUT */
response = http.put(`${posts}/1`, data, headers)
log.info(response)
log.info('*'.repeat(100))

/* DELETE */
response = http.delete(`${posts}/1`)
log.info(response)
log.info('*'.repeat(100))
