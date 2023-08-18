module.exports = {
    
    suites: [
        {
            name: 'Sanity',
            cases: [
                { path: './Feautures/Parameters.js' },
                { path: './Feautures/Page Objects.js' },
            ]
        },
        {
            name: 'End to End',
            cases: [
                { path: './Feautures/File Sync.js' },
                { path: './Feautures/File Upload.js' },
            ]
        }
    ],

    modules: [
        'web', 'log', 'assert', 'http',
        'db', 'email', 'mob', 'date', 'pdf', 'win'
    ],

    reporting: {
        reporters: ['html', 'json']
    },

}