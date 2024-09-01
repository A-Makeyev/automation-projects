// for configuration visit: https://appuals.com/fix-your-imap-server-wants-to-alert-you-invalid-credentials

// define email server details
// email.init(
//     'anatoly.makeyev@cloudbeat.io',     // email address 
//     'xxxx xxxx xxxx xxxx',              // app password
//     'imap.gmail.com',                   // IMAP server address. Current example is for Gmail
//     993,                                // IMAP server port. Current example is for Gmail
//     true,                               // specifies whether to use TLS or not. Current example is for Gmail
//     9000                                // connection timeout in milliseconds
// )

email.init('anatoly.makeyev@cloudbeat.io', 'cewh wcss ccen xpqm', 'imap.gmail.com', 993, true, 9000)
email.send('anatoly.makeyev@gmail.com', 'subject', 'asd')

// // retrieve the email
// var mail = email.getLastEmail(
//     60,                                  // retrieve mails received in the last 5 minutes
//     'Your verification code',            // retrieve email containing "Your verification code" in its subject
//     9000                                 // fail if email if matching email is not found within 10,000 milliseconds
// )                                        // for example, our body will be: "Your OTP is: 123"
             

// log.info(mail);

// // extract OTP from email's body
// log.info('~~~~~~~~~~~~~~~~~~~~~')

// var body = mail.body
// log.info('Mail Body: ' + body)

// var otp = body.match(/\d+/g).toString()
// log.info('OTP: ' + otp)

// var result = /.*Your OTP is: ([0-9]*).*/g.exec(mail.body)
// var otp = result[1]
// log.info(otp)
