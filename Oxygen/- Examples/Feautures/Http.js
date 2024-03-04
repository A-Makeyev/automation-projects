// add http module in oxygen.conf.js
// module.exports = {
//     modules: ['web', 'log', 'http', 'db']
// }

http.setOptions({
    timeout: {
        lookup: 1000,
        connect: 2*1000,
        secureConnect: 2*1000,
        socket: 100000,
        send: 100000,
        response: 1*60*1000
    },
})

var url = 'https://jsonplaceholder.typicode.com'

var headers = {
	'Content-Type': 'application/json' 
}

var data = { 
	username: "NewUsername",
	country: "Switzerland"
}

var users = http.get(url + '/users', headers)
log.info(users[0])

var put = http.put(url + '/users/1', data)
log.info(put)

var post = http.post(url + '/users/2', data, headers)
log.info(post)

http.delete(url + '/users/3')
