module.exports = {
    
    suites: [{
        name: 'E2E',
        cases: [
            { path: './Scripts/01. הפניה לנבדק נפטר.js' },
            { path: './Scripts/02. פתיחת הפנייה לנבדק שלא קיים במשרד הרישוי.js' },
            { path: './Scripts/03. פתיחת הפנייה רגילה.js' },
            { path: './Scripts/04. עדכון שם נבדק.js' },
            { path: './Scripts/05. תהליך של התליה ושחרור מהתליה.js' },
            { path: './Scripts/06. הוספת דרגה ושרשור לדרגת בת.js' },
        ]
    }],

    modules: ['web', 'log', 'assert'],

    reporting: {
        reporters: ['html', 'json']
    },

}