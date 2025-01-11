var fs = require('fs')
var filePath = './Data/pdf.pdf'

if (fs.existsSync(filePath)) {
	pdf.assert(filePath, 'Hello World', 1, 'Text was not found in PDF')
	pdf.assertNot(filePath, 'Whats Up World', 1, 'Text was found in PDF')

	var world_count = pdf.count(filePath, 'World', 1, true)
	log.info('The word World appears: ' + world_count + ' time inside this PDF')
}
