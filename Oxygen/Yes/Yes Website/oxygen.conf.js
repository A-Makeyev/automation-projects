module.exports = {

    suites: [
        {
            name: 'Sanity',
            cases: [
                { path: './Sanity/1. כניסה ללקוחות רשומים.js' },
                { path: './Sanity/2. תצוגת תפריט עליון.js' },
                { path: './Sanity/3. תצוגה תפריט תחתון.js' },
                { path: './Sanity/4. זימון טכנאים.js' },
                { path: './Sanity/5. בדיקת לוח שידורים.js' },
                { path: './Sanity/6. ביצוע הקלטה.js' },
            ]
        }, 
    ],

    modules: ['web', 'assert', 'log', 'http', 'utils']

}
