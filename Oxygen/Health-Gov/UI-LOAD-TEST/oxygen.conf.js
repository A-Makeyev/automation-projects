module.exports = {
    
    suites: [{
        name: 'UI Performance Tests',
        cases: [
            { path: './Scripts/01. Load Braini Windows.js' },
            { path: './Scripts/02. Corona Flight Check.js' },
            { path: './Scripts/03. Corona Isolation Calculator.js' },
            { path: './Scripts/04. Corona Parks Capacity Map.js' },
            { path: './Scripts/05. 05. Appointments.js' },
            { path: './Scripts/05. 05. 06. Quarantine Document Check.js' },
        ]
    }],

    modules: ['web', 'log', 'assert', 'email'],

    reporting: {
        reporters: ['html', 'json']
    },

}