module.exports = {

    suites: [
        {
            name: 'Gas Payment',    
            cases: [            
                { path: './Gas Payment/1. לקוח לא מזוהה (מסלול ירוק) עם חשבונית 1 בלבד שלא שולמה.js' },
                { path: './Gas Payment/2. לקוח לא מזוהה (מסלול ירוק) עם יותר מחשבונית 1 שלא שולמה.js' },
                { path: './Gas Payment/3. תשלום חשבון גז - לקוח לא מזוהה (מסלול ירוק) חשבונית שכבר שולמה.js' },
                { path: './Gas Payment/4. תשלום חשבון גז - לקוח לא מזוהה (מסלול ירוק) בסטטוס חסום לתהליך תשלום .js' },
            ]        
        },
    ],

    modules: ['web', 'log', 'assert', 'http', 'https']

}
