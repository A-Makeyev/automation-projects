function hideStoryFromEveryone(hide) {
  const maxAttempts = 200
  const hideStoryButtonXPath = '//div[contains(@style, "circle__outline")]'
  const showStoryButtonXPath = '//div[contains(@style, "circle-check__filled")]'
  
  for (let index = 1; index <= maxAttempts; index++) {
    const xpath = `(${hide ? showStoryButtonXPath : hideStoryButtonXPath})[${index}]`
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue
    
    if (result !== null) {
      result.scrollIntoView()
      result.click()
    }
  }
}

hideStoryFromEveryone()
