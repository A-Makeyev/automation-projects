module.exports = {
    
    suites: [{
        name: 'Sanity',
        cases: [
            { path: '/' },
            { path: '/' },
        ]
    }],

    modules: ['mob', 'log', 'assert', 'http'],

    reporting: {
        reporters: ['html', 'json']
    },

}