module.exports = {

    TEST: {
        url: 'http://ccxrm16t/ContactCenterMOHEducation/main.aspx',
        url_korona: 'https://xrm365t.moh.health.gov.il/Korona/main.aspx',
        /* http://CloudBeatTST_User:Cdb12%23@ccxrm16t/ContactCenterMOHEducation/main.aspx */
        con_string: '',
        users: {
            public_inq: {
                username: 'qflow.test1',
                password: 'Aa123456'
            },
            BO_rep: {
                username: 'qflow.test2',
                password: 'flow1!',
            },
            translation_rep: {
                username: 'qflow.test3',
                password: 'flow1!'
            },
            amar_rep: {
                username: 'qflow.test4',
                password: 'flow1!'
            },
            kvilot: {
                username: 'qflow.test5',
                password: 'flow1!'
            },
            moked_rep: {
                username: 'qflow.test6',
                password: 'flow1!'
            },
            general_user: {
                username: 'learning5',
                password: 'lear1!'
            },
        },
    },

    PREP: {
        url: '',
        con_string: '',
        username: '',
        password: ''
    },

    PROD: {
        url: '',
        con_string: '',
        username: '',
        password: ''
    },

}