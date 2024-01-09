// add db module in oxygen.conf.js
// module.exports = {
//     modules: ['web', 'log', 'http', 'db']
// }

// Examples of connection strings
// https://www.connectionstrings.com

web.transaction("01. Connect to Customers Database")
db.setConnectionString("Driver={SQL Server}; Server=DESKTOP-KDQHUS7\\SQLEXPRESS; Database=Customers; Trusted_Connection=True")
// db.setConnectionString("Driver={SQL Server}; Server=DESKTOP-KDQHUS7\\SQLEXPRESS; Database=Customers; User Id=username; Password=password ")

web.transaction("02. Fetch Customer Table")
// Executes an SQL query and returns the result set
var table = db.executeQuery("SELECT * FROM Customer")
log.info(table)

var firstCustomerCountry = table[0].Country
log.info("Country: " + firstCustomerCountry)

web.transaction("03. Update Customer's Country")
// Executes an SQL statement. Any results from the query are discarded
db.executeNonQuery("UPDATE Customer SET Country = 'Germany' WHERE ID = 1")

web.transaction("04. Fetch Customer's New Country")
// Executes SQL query and returns the first column of the first row in the result set
var country = db.getScalar('SELECT Country FROM Customer WHERE ID = 1')
log.info("New Country: " + country)
