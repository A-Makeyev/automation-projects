module.exports = {
    
    suites: [{
        name: 'Sanity',
        cases: [
            { path: '/Sanity/01. Create Case.js' },
            { path: '/Sanity/02. ' },
        ]
    }],

    modules: ['web', 'log', 'assert', 'http'],

    reporting: {
        reporters: ['html', 'json']
    },

}