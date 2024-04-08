module.exports = {
    
    suites: [{
        name: 'Login Tests',
        cases: [
            { path: './Auth/Login Validation.js' },
            { path: './Auth/Login Page Elements.js' }, 
            { path: './Auth/Register First Step Error Validation.js' }, 
        ]
    }],

    modules: ['web', 'log', 'assert', 'http'],

    reporting: {
        reporters: ['html', 'json']
    },

}