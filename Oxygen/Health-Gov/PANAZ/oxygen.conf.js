module.exports = {
    
    suites: [
        {
            name: 'Korona',
            cases: [
                { path: './Korona/01. פניות קורונה - בקשת מידע.js' },
                { path: './Korona/02. פניות קורונה - חריגת קופת חולים.js' },
                { path: './Korona/03. פניות קורונה - איסוף פלזמה.js' },
                { path: './Korona/04. פניות קורונה - מידע למשפחות קשישים.js' },
                { path: './Korona/05. פניות קורונה - מידע למוסדות גריאטריים.js' },
                { path: './Korona/06. פניות קורונה - חסרי מעמד.js' },
                { path: './Korona/07. פניות קורונה - יציאה חריגה מבידוד.js' },
            ]
        },
        {
            name: 'E2E',
            cases: [
                { path: './End to End/01. פניית מוקד מסוג בקשת מידע עם הקצאות.js' },
                { path: './End to End/02.  פניות בירור סטאטוס - מרבד ואמר.js' },
                { path: './End to End/03. (פניות זימון תור (חיסונים.js' },
                { path: './End to End/04. מחשבון חישוב ימי עסקים.js' },
                { path: './End to End/05. מוקד תרגום.js' },
                { path: './End to End/06. מוקד גמילה מעישון.js' },
                { path: './End to End/07. מוקד אחיות טיפת חלב.js' },
            ]
        },
    ],

    modules: ['web', 'log', 'assert', 'db', 'email'],

    reporting: {
        reporters: ['html', 'json']
    },

}