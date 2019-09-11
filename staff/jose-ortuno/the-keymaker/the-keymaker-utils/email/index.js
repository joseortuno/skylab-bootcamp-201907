require('dotenv').config()
const nodemailer = require('nodemailer');
const { env: { SMTP_USER, SMTP_PASS, SMTP_HOST, SMPT_PORT, SMTP_SECURE } } = process

module.exports = function (aliasGuest, emailGuest) {
    // Generate test SMTP service account from ethereal.emails
    
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMPT_PORT,
        secure: SMTP_SECURE, // true for 465, false for other ports
        auth: {
            user: SMTP_USER, // generated ethereal user
            pass: SMTP_PASS // generated ethereal password
        }
    })
    
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"TheKeymaker 🔑👉🏠" <key@thekeymaker.com>', // sender address
        to: emailGuest, // list of receivers
        subject: 'Hello' + aliasGuest + '!' + 'Key 🔑👉🏠', // Subject line
        text: 'Hello!' + aliasGuest, // plain text body
        html: '<b>Hello world?</b>' // html body
    });
    
    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}