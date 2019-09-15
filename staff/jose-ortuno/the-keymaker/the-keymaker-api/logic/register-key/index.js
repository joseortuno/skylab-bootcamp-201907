const { models: { User, Deployment, Key } } = require('the-keymaker-data')
const { validate } = require('the-keymaker-utils')
const { env: { JWT_SECRET } } = process
const jwt = require('jsonwebtoken')
const moment = require('moment')
const nodemailer = require('nodemailer')

const { env: { SMTP_USER, SMTP_PASS, SMTP_HOST, SMPT_PORT, SMTP_SECURE } } = process

module.exports =
    /**
     * Key generator to access the floors. The key has a certain time of use. Generate a token with temporary access.
     * 
     * @param {*} validFrom: valid from
     * @param {*} validUntil: valid until
     * @param {*} aliasGuest: guest alias
     * @param {*} emailGuest: email guest
     * @param {*} deploymentId: deployment id
     * @param {*} userId: user id
     * 
     * @return {Promises}
     * @return {token}: includes key id and activation and expiration times
     */
    function (validFrom, validUntil, aliasGuest, emailGuest, deploymentId, userId) {
        // TODO: Validate date
        // if(typeof validFrom === 'object') throw new Error(`valid from with value ${validFrom} is not a valid date`)
        // if(typeof validUntil === 'object') throw new Error(`valid from with value ${validUntil} is not a valid date`)
        debugger
        // validate more
        validate.string(aliasGuest, 'alias guest')
        validate.string(emailGuest, 'email guest')
        validate.email(emailGuest, 'email guest')
        validate.string(deploymentId, 'deployment id')
        validate.string(userId, 'user id')

        // date data
        const createdAt = moment(new Date())
        const getValidFrom = moment(validFrom)
        const getValidUntil = moment(validUntil)
        const from = getValidFrom.diff(createdAt, 'seconds')
        const expiry = getValidUntil.diff(createdAt, 'seconds')

        return (async () => {
            // check that the user exists
            const user = await User.findById(userId)
            if (!user) throw Error('Wrong credentials')
            // check that the deployment exists
            const deployment = await Deployment.findById(deploymentId)
            if (!deployment) throw Error('Wrong deployment')
            // create key sin token
            const key = await Key.create({ created_at: createdAt, valid_from: validFrom, valid_until: validUntil, status: 'waiting', alias_guest: aliasGuest, email_guest: emailGuest, deployment: deploymentId, user: userId })
            const keyId = key._id.toString()
            // create token, insert key id
            const _token = jwt.sign({
                sub: key._id.toString()
            }, JWT_SECRET, {
                    notBefore: from,
                    expiresIn: expiry
                })

            // update key, insert token
            const update = { token: _token }
            await Key.updateOne({ _id: key._id.toString() }, { $set: update })

            /************************************************************************
             * EMAIL INIT
             ************************************************************************/
            
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

            // TODO: conseguir dirección deployment. separar fecha y hora.

            const subjectMail = `hello ${aliasGuest}! Key 🔑👉🏠`
            const textMail = `hello ${aliasGuest}!
you have an agreed visit to visit a property.
opening time visit to the property:
  - entry date: ${validFrom}
  - departure date: ${validUntil}
  - start time: XX
  - end time: XX

  - property address: XX
  
  <a href="">http://localhost:3000/#/deployments/get-key/${keyId}</a>`

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"TheKeymaker 🔑👉🏠" <key@thekeymaker.com>', // sender address
                to: emailGuest, // list of receivers
                subject: subjectMail, // Subject line
                text: textMail, // plain text body
                html: `<b>${textMail}</b>` // html body
            });

            console.log('Message sent: %s', info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            
            /************************************************************************
             * EMAIL FINISH
            ************************************************************************/

            return { id: keyId, token: _token }
        })()
    }

