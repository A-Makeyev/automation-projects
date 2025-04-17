module.exports = {
    
    suites: [
        {
            name: 'Tests',
            cases: [
                { path: './Tests/Products.js' },
                { path: './Tests/Login.js' },
            ]
        },
    ],

    modules: ['web', 'log', 'assert', 'http', 'db', 'email', 'mob', 'date', 'pdf', 'win'],

    reporting: {
        reporters: ['html', 'json']
    },

}