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

const username = 'xxxxxxxx'
const password = 'xxxxxxxx'
const encodedCredentials = Buffer.from(username + ':' + password).toString('base64')

const baseURL = 'https://jsonplaceholder.typicode.com/'
const posts = `${baseURL}/posts`

const headers = {
    "Authorization": `Basic ${encodedCredentials}`,
	"Content-type": "application/json; charset=UTF-8"
}

const data = {
    title: "foo",
    body: "bar",
    userId: 1,
}



////////////////////////////////////////////////////////////////////////////



/* GET */
const response = http.get(posts)
const body = response.body
const userId = response.body.userId
log.info(body)

/* POST */
const response = http.post(posts, data, headers)
const body = response.body
log.info(response)

/* PUT */
const response = http.put(`${posts}/1`, data, headers)
log.info(response)

/* DELETE */
const response = http.delete(`${posts}/1`)
log.info(response)

