// require('dotenv').config()
const nodemailer = require('nodemailer')
const { validate } = require('../index')
// const { env: { SMTP_USER, SMTP_PASS, SMTP_HOST, SMPT_PORT, SMTP_SECURE } } = process

module.exports = function (aliasGuest, emailGuest) {
    validate.string(aliasGuest, 'alias guest')
    validate.string(emailGuest, 'email guest')

    // Generate test SMTP service account from ethereal.emails
    
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'keymakergenerate@gmail.com', // generated ethereal user
            pass: 'VYZvm8GpJjGmend' // generated ethereal password
        }
    })

    return (async () => {
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
    })
}