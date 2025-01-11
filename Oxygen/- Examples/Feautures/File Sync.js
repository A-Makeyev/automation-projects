var fs = require('fs')

for (let x = 0; x <= 10; x++)
    // fs.appendFileSync('C:\\Users\\Makeyev\\Desktop\\test.txt', `${x} hello text \n`)
    fs.appendFileSync('/Users/anatolymakeyev/Desktop/test.txt', `${x} hello text \n`)
    

var fileType = 'csv'
var fileName = 'Customers'

/* windows */
// var filePath = 'C:\\Users\\Makeyev\\Desktop'
// var file = `${filePath}\\${fileName}.${fileType}`

/* mac */
var filePath = '/Users/anatolymakeyev/Desktop'
var file = `${filePath}/${fileName}.${fileType}`


var customers = [
  { "email": "lea.ham@hotmail.com", "name": "Leanne Graham", "products": 10, },
  { "email": "ervo271@gmail.com", "name": "Ervin Howell", "products": 22, },
  { "email": "buch69@yahoo.com", "name": "Clementine Bauch", "products": 99, },
  { "email": "arkasha.m@live.com", "name": "Arkadius Morphy", "products": 420, },
  { "email": "xXxz0c0xXx@gmail.com", "name": "Zohen Cohen", "products": 0, },
  { "email": "bonbon.vil@live.com", "name": "Esterbon Villalon", "products": 69, }
]


existingCustomers = []

// if the file doesn't exist, create a new file
if (!fs.existsSync(file)) {
    log.info('Created new file: ' + file)
    fs.appendFileSync(file, 'Email, Name, Products \n')

    for (let x = 0; x < customers.length; x++) {
        fs.appendFileSync(
            file,
            `${customers[x].email}, ${customers[x].name}, ${customers[x].products} \n`
        )
        existingCustomers.push(customers[x])
        log.info('Added: ' + customers[x].name)
    }
} else {
    // if the file already exists, add to it
    log.info('Adding to an existing file: ' + file)

    for (let x = 0; x < customers.length; x++) {
        fs.appendFileSync(
            file,
            `${customers[x].email}, ${customers[x].name}, ${customers[x].products} \n`
        )
        existingCustomers.push(customers[x])
        log.info('Added: ' + customers[x].name)
    }
}


log.info('Existing Customers: ')
log.info(existingCustomers)


// delete file
try {
    fs.unlinkSync(file)
} catch(err) {
    console.error(err)
}