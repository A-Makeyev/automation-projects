module.exports = {
    
    suites: [
        {
            name: 'Sanity -> Menu',
            cases: [
                { path: './Tests/Menu/01 כפתור אודות.js' },
                { path: './Tests/Menu/02 כפתור איך זה עובד.js' },
                { path: './Tests/Menu/03 כפתור שאלות ותשובות.js' },
                { path: './Tests/Menu/04 כפתור תקנון מדיניות פרטיות.js' },
                { path: './Tests/Menu/05 כפתור טיפים לחיסכון בדלק.js' },
                { path: './Tests/Menu/06 כפתור היסטורית תשלומים.js' },
                { path: './Tests/Menu/07 כפתור התנתק.js' },
                { path: './Tests/Menu/08 כפתור כניסה למנהל צי רכב.js' },
                { path: './Tests/Menu/09 גרסת אפליקציה.js' },
                { path: './Tests/Menu/10 בחירת נושא פנייה - מייל.js' },
            ]
        },
        {
            name: 'Sanity -> Stations',
            cases: [
                { path: './Tests/Stations/01 איתור לפי מיקום.js' },
                { path: './Tests/Stations/02 פילטרים.js' },
                { path: './Tests/Stations/03 חיפוש במלל חופשי.js' },
                { path: './Tests/Stations/04 חיפוש ריק.js' },
                { path: './Tests/Stations/05 חיפוש של תוצאה לא קיימת.js' },
                { path: './Tests/Stations/06 הפעלת ווייז.js' },
                { path: './Tests/Stations/07 טלפון.js' },
            ]
        },
        {
            name: 'Sanity -> Profile',
            cases: [
                { path: './Tests/Profile/01 אזור אישי .js' },
                { path: './Tests/Profile/02 עריכת פרופיל .js' },
            ]
        },
    ],

    modules: ['mob', 'log', 'assert', 'http'],

    reporting: {
        reporters: ['html', 'json']
    },

}