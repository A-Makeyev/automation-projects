var index = 1
var tries = 200
var hideStoryButton = '//div[@data-bloks-name="ig.components.Icon" and contains(@style, "rgb(219, 219, 219)") and not(contains(@style, "search"))]'

var showStoryButton = '//div[@data-bloks-name="ig.components.Icon" and contains(@style, "rgb(0, 149, 246)") and not(contains(@style, "search"))]'


while(index < tries) { 
    document.evaluate(
        `(${hideStoryButton})[${index}]`,
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
    ).singleNodeValue.click()
	index++
	tries--
}

while(index < tries) { 
    document.evaluate(
        `(${showStoryButton})[${index}]`,
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
    ).singleNodeValue.click()
	index++
	tries--
}
