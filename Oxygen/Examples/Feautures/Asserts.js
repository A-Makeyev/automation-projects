web.init()
web.open('https://demoqa.com/')
web.setTimeout(7000)

web.click('//h5[text()="Elements"]')

// assert that a specific text is present in the page
web.assertTextPresent('Please select an item from left to start practice')

web.click('//span[text()="Text Box"]')

web.type('id=userName', 'James')
// wait for an element to have the value 
web.waitForValue('id=userName', 'James')

web.click('id=submit')

// wait for an element to exist in the DOM
web.waitForExist('id=name')

// wait for an element to be visible in the DOM
web.waitForVisible('id=name')

// checks in an element exists and returns true or false accordingly 
// and assigning it to a variable called isNameExists
var isNameExists = web.isExist('id=name')

// asserts if the element exists
assert.equal(isNameExists, true)

// the same for is visible but without a variable
assert.equal(web.isVisible('id=name'), true)

// gets the text from an element
var name = web.getText('id=name')

// asserts that an element contains a specific text value
assert.contain(name, 'Name:James')
