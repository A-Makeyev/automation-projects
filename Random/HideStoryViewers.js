function sleep(ms) {
    const end = Date.now() + ms
    while (Date.now() < end) {}
}

function hideOrShowStory(action) {
	var index = 1
	var tries = 200
	var hideStoryButton = '//div[contains(@style, "circle__outline")]'
	var showStoryButton = '//div[contains(@style, "circle-check__filled")]'
	
	while(index <= tries) { 
	    const result = document.evaluate(
	        `(${action === 'hide' ? hideStoryButton : showStoryButton})[${index}]`,
	        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
	    ).singleNodeValue

		if (result !== null) {
			result.scrollIntoView({ behavior: "smooth", block: "center" })
			sleep(400)
			result.click()
			sleep(400)
		}
		
		index++
		tries--
	}
}

hideOrShowStory('hide')
