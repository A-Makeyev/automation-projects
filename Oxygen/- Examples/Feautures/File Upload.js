web.init()
web.open('https://imgur.com/upload')

const mac_path = '/Users/anatolymakeyev/Desktop/oxygen-sample-project/Data/image-to-upload.jpg'
const windows_path = 'C:\\Users\\Makeyev\\Desktop\\test-automation\\OXYGEN\\Examples\\Data\\image-to-upload.jpg'

function uploadFile(os, element, path) {
	if (os == 'mac') {
		web.makeVisible(element)
		web.fileBrowse(element, path)
	}

	if (os == 'windows') {
		web.makeVisible(element)
		web.fileBrowse(element, path)
	}
}

uploadFile('windows', 'id=file-input', windows_path)

// web.makeVisible('id=file-input')
// web.type('id=file-input', mac_path)

web.pause(7 * 1000)