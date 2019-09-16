const nodemailer = require('nodemailer')
const moment = require('moment')

const { env: { SMTP_USER, SMTP_PASS, SMTP_HOST, SMPT_PORT, SMTP_SECURE } } = process

/************************************************************************
 * EMAIL INIT
 ************************************************************************/

module.exports = async (keyId, emailGuest, aliasGuest, validFrom, validUntil, aliasDeployment, logoDeployment) => {
    // email(aliasGuest, emailGuest) // utils

    // Generate test SMTP service account from ethereal.emails

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: SMTP_USER, // generated ethereal user
            pass: SMTP_PASS // generated ethereal password
        }
    })

    // transform date
    const from = moment(validFrom)
    const until = moment(validUntil)


    // content email
    const subjectMail = `hello ${aliasGuest}! Key 🔑👉🏠`
    
    const textMail = `. opening time visit to the property: - entry date: ${validFrom} - departure date: ${validUntil} - start time: XX - end time: XX - property address: XX <a href="">http://localhost:3000/#/deployments/get-key/${keyId}</a>`
    
    const htmlMail = `<table>
<tr>
    <td>
        the keymaker
  </td>
</tr>
<tr>
    <td>
        hello ${aliasGuest}! you have an agreed visit to a property: ${aliasDeployment}
  </td>
</tr>
<tr>
    <td>
        <img src="${logoDeployment}" />
  </td>
</tr>
<tr>
    <td>
        opening time visit to the property: 
        <ul>
            <li>property: ${aliasDeployment}</li>
            <li>entry date: ${from}</li>
            <li>departure date: ${until}</li>
            <li>start time: XX</li>
            <li>end time: XX</li>
            <li>property address: XX</li>
    </td>
</tr>
<td>
<a href="http://localhost:3000/#/access/${keyId}">ACCESS</a>
</td>
</table>`

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"TheKeymake" <key@thekeymaker.com>', // sender address
        to: emailGuest, // list of receivers
        subject: subjectMail, // Subject line
        text: textMail, // plain text body
        html: htmlMail // html body
    });

    return ('Message sent: %s', info.messageId)

    /************************************************************************
     * EMAIL FINISH
    ************************************************************************/

}