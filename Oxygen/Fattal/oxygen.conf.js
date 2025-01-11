module.exports = {

    suites: [
        {
            name: 'Sanity',
            cases: [
                { path: './Scripts/Assert Deal Price.js' },
            ]
        },
    ],

    modules: ['web', 'log', 'assert']

}