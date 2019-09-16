const { models: { User, Deployment, Key } } = require('the-keymaker-data')
const { validate } = require('the-keymaker-utils')
const { env: { JWT_SECRET } } = process
const jwt = require('jsonwebtoken')
const moment = require('moment')
const sendEmail = require('../../helpers/send-email')

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
            // check que ninguna llave exista en la franja horaria especificada
            const keys = await Key.find({ user: userId }, { __v: 0 })
            if (keys.length !== 0) {
                const select = keys.map(key => {
                    if (key.deployment._id.toString() === deploymentId) return key
                })
                if(select) select.forEach(element => {
                    if (validFrom > element.valid_from && validFrom < element.valid_until || validUntil > element.valid_from && validUntil < element.valid_until) throw Error('sorry, the requested time slot is busy')
                })
            }

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

            /*EMAIL INIT************************************************************/
            let info
            const successEmail = await sendEmail(keyId, emailGuest, aliasGuest, validFrom, validUntil, deployment.alias, deployment.logo)
            if(successEmail) info = 'email sent correctly' 
            else info = 'email not sent'
            /*EMAIL FINISH**********************************************************/

            return { id: keyId, token: _token, email: info }
        })()
    }

