date.now() // 2021-03-04T13:02:38+02:00
log.info(date.now())

date.now("ddd, hA") // Thu, 12PM

date.now('DD/MM/YYYY') // 04/03/2021

date.now("[Today is] dddd") // Today is Thursday

date.now("dddd, MMMM Do YYYY, h:mm:ss a") // Thursday, March 4th 2021, 12:41:22 pm


date.fromNow('2', 'days') // 2021-03-06T13:02:38+02:00

date.fromNow('2', 'months') // 2021-05-04T13:02:38+03:00

date.fromNow('2', 'years') // 2023-03-04T13:02:38+02:00


var today = date.now('DD/MM/YYYY')
log.info('Today: ' + today)

var tomorrow = date.fromNow('1', 'days')
tomorrow = tomorrow.slice(0, 10)

tomorrow = tomorrow.split('-').reverse().join('/')
log.info('Tomorrow: ' + tomorrow)


let dateAndTime = new Date()
let dd = String(dateAndTime.getDate()).padStart(2, "0")
let mm = String(dateAndTime.getMonth() + 1).padStart(2, "0")
let yyyy = dateAndTime.getFullYear()
let hours = dateAndTime.getHours()
let minutes = dateAndTime.getMinutes()
let seconds = dateAndTime.getSeconds()

hours = hours < 10 ? '0' + hours : hours
minutes = minutes < 10 ? '0' + minutes : minutes
seconds = seconds < 10 ? '0' + seconds : seconds

let format = `${dd}-${mm}-${yyyy} ${hours}:${minutes}:${seconds}`
log.info(format)
