module.exports = {
    
  "iterations": 1,
  "parallel": 1,
    
  "url": "http://localhost:4444/wd/hub",
    
    suites: [{
        name: 'case1',
        cases: [{
            path: "./spinoa - normal.js"
        }],
      },
      {
        name: 'case2',
        cases: [{
            path: "./spinoa - page objects.js"
        }],
    }],
    
  "environment": {
    "some_parameter": "foo",
    "another_parameter": "bar"
  },
    
  "capabilities": [
    { 
      "browserName": "chrome"
    }
  ],
    
  "options": {
    "autoReopen": true
  }
    
}