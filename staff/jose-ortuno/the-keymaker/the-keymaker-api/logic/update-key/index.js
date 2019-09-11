const { models: { Key, User } } = require('the-keymaker-data')
const { validate } = require('the-keymaker-utils')

module.exports =
    /**
     * Update key: canceled (date), status: ['waiting', 'visited', 'expired', 'cancelled']
     * 
     * @param {string} id: User id
     * @param {object} update: update data user
     * 
     * @return {promise}
     * 
     * @throws {Error} param key id: 
     * @throws {TypeError} param update: second param is empty or is not object
     * @throws {SyntaxError} param update: update object is empty
     * 
     */
    function (userId, keyId, update) {
        validate.string(userId, 'user id')
        validate.string(keyId, 'key id')
        if (!(update instanceof Object) || update === undefined) throw TypeError('second param is empty or is not object')
        if (Object.keys(update).length === 0) throw SyntaxError('update object is empty')

        if (update.canceled) validate.date(update.canceled, 'canceled')
        if (update.status) validate.string(update.status, 'status')

        if (update.created_at || update.valid_from || update.valid_until || update.alias_guest || update.email_guest || update.deployment || update.user || update.token || update.user || update.id || update.used_at) throw Error('non modificable field')

        if (update.status === 'waiting' || update.status === 'visited') throw Error('field only modificable to cancel or expired key')

        return (async () => {
            const user = await User.findById(userId)
            if(!user) throw new Error('wrong user credentials')

            const key = await Key.findOne({ _id: keyId }).lean()
            if (key.status === 'cancelled' || key.canceled) throw Error('key cancelled')
            if (key.used_at) throw Error('key used')

            const { nModified, ok } = await Key.updateOne({ _id: keyId }, { $set: update })

            if (!nModified && !ok) throw Error(`key with id ${keyId} does not exist`)
        })()
    }