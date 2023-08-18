module.exports = { 

    suites: [
        {
            name: 'Self Service',
            cases: [
                { path: './Self Service/0 - Reset Transactions Count.js' },
                { path: './Self Service/1 - SelfService Prepaid credit with limit.js' },
                { path: './Self Service/2 - SelfService Prepaid credit no limit.js' },
                { path: './Self Service/3 - SelfService Prepaid credit over limit.js' },
                { path: './Self Service/4 - SelfService Prepaid credit 0 with limit.js' },
                { path: './Self Service/5 - SelfService Prepaid credit 0 no limitjs.js' },
                { path: './Self Service/6 - SelfService PrePaid Credit with Hot Club Discount.js' },
                { path: './Self Service/7 - SelfService Prepaid dlkn card with limit.js' },
                { path: './Self Service/8 - SelfService Prepaid dlkn card no limit.js' },
                { path: './Self Service/9 - SelfService Prepaid dlkn card over limit.js' },
                { path: './Self Service/10 - SelfService Prepaid dlkn card with  wrong car num.js' },

                { path: './Self Service/12 - SelfService Prepaid dlkn card with  wrong code.js' },
                { path: './Self Service/13 - SelfService prepaid IDF card + code with limit.js' },
                { path: './Self Service/14 - SelfService prepaid IDF card + code with no limit.js' },
                { path: './Self Service/15 - SelfService prepaid IDF card  משהבט + code with limit.js' },
                { path: './Self Service/16 - SelfService prepaid IDF card  משהבט + code with no limit.js' },
                { path: './Self Service/17 - SelfService prepaid IDF card  משהבט + no code  with limit.js' },
                { path: './Self Service/18 - SelfService prepaid IDF card  משהבט + no code  no limit.js' },
                { path: './Self Service/19 - SelfService prepaid IDF dlkn + code with Digital code צריך להקליט מחדש.js' },
                { path: './Self Service/20 - SelfService prepaid IDF dlkn + no code with Digital code צריך להקליט מחדש.js' },
            ]
        }
    ],

    modules: ['log', 'utils', 'assert', 'shell']
}