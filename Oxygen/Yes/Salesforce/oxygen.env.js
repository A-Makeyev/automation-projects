module.exports = {

    prod: {
        name: 'PROD',
        url: 'https://alphacrm.lightning.force.com',
        username: 'qausr01@yes.co.il', 
        password: 'Aa1234569',
    },

    prep: {
        name: 'PREP',
        url: 'https://alphacrm--prep.my.salesforce.com',
        sandbox_url: 'https://alphacrm--prep.sandbox.my.salesforce.com',
        wiz_con_string: 'Driver={Oracle in instantclient_11_2};DBQ=10.10.100.164:1521/wizard;UID=PROD7;PWD=PROD7;QTO=F;',
        ods_master_con_string: 'Driver={Oracle in instantclient_11_2};DBQ=vodstst1:1521/ods;UID=ods_master;PWD=odsmaster;QTO=F;',
        ods_customer_con_string: 'Driver={Oracle in instantclient_11_2};DBQ=vodstst1:1521/ods;UID=customer_data;PWD=yes2013;QTO=F;',
        username: 'qausr01@yes.co.il.alphacrm.prep', 
        password: 'Aa1234569',
    },

    qa: {
        name: 'QA',
        url: 'https://alphacrm--qaall.lightning.force.com',
        wiz_con_string: 'Driver={Oracle in instantclient_11_2};DBQ=10.24.10.120:1521/wizct2;UID=prod7;PWD=prod7;QTO=F;', 
        ods_master_con_string: 'Driver={Oracle in instantclient_11_2};DBQ=vodstst1:1521/ods;UID=ods_master;PWD=odsmaster;QTO=F;',
        ods_customer_con_string: 'Driver={Oracle in instantclient_11_2};DBQ=vodstst1:1521/ods;UID=customer_data;PWD=yes2013;QTO=F;',
        username: 'qausr01@yes.co.il.qaall', 
        password: 'Aa12345678'
    },
    
    train: {
        name: 'TRAIN',
        url: 'https://alphacrm--trainall.lightning.force.com',
        wiz_con_string: 'Driver={Oracle in instantclient_11_2};DBQ=10.10.150.118:1521/wiztrain;UID=prod7;PWD=prod7;',
        username: 'usertrain101@alphacrm.trainall',
        password: 'Aa111111'
    },
    
    dev: {
        name: 'DEV',
        url: 'https://alphadev1--dev4cb.my.salesforce.com',
        wiz_con_string: 'Driver={Oracle in instantclient_11_2};DBQ=10.10.100.7:1521/wizdev;UID=prod7;PWD=prod7;',
        username: 'qausr01@yes.co.il.dev4cb',
        password: 'workit1!'
    },    

    default: {
        name: 'default',
        url: 'https://salesforce.com'
    },

}
