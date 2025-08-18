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


const xpath = '//div[contains(@style, "circle__outline")]'
// const xpath = '//div[contains(@style, "circle-check__filled")]'

const result = document.evaluate(
  xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
)

for (let i = 0; i < result.snapshotLength; i++) {
  const el = result.snapshotItem(i)
  if (el) {
    el.click()
  }
}
