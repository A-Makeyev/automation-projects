module.exports = {
    
    suites: [
        {
            name: 'Login Tests',
            cases: [
                { path: './Auth/Login Validation.js' },
                { path: './Auth/Login Page Elements.js' }, 
                { path: './Auth/Register Password Rules.js' }, 
                { path: './Auth/Register First Step Error Validation.js' }, 
                { path: './Auth/Forgot Password Page Elements.js' }, 
                { path: './Auth/Forgot Password Validation.js' }, 
                { path: './Auth/Forgot Password Errors.js' }, 
                { path: './Auth/Forgot Password Rules.js' }, 
            ]
        },
        {
            name: 'Dashboard Tests',
            cases: [
                { path: './Main Dashboard/Suggested Products.js' },
            ]
        },
    ],

    modules: ['web', 'log', 'assert', 'http', 'email'],

}