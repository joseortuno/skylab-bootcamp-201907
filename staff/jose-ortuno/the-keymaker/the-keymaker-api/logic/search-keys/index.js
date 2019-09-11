const { models: { Key } } = require('the-keymaker-data')
const { validate } = require('the-keymaker-utils')

module.exports =
    /**
     * Search keys
     * 
     * @param {String} searchParamsAndUserId
     * 
     * @return {Array} array keys
     * 
     * @throws {Error} param object search: Input search param is not an Object
     * @throws {Error} Input is empty
     * @throws {Error} param alias guest: alias guest is not a string
     * @throws {Error} param email guest: email guest is not a string
     * @throws {Error} param deployment: deployment is not a string
     */
    function (searchParamsAndUserId) {
        if (!(searchParamsAndUserId instanceof Object)) throw Error(`input ${searchParamsAndUserId} is not an object`)
        if (Object.keys(searchParamsAndUserId).length === 0) throw Error('input is empty')
        if (searchParamsAndUserId.alias_guest) validate.string(searchParamsAndUserId.alias_guest, 'alias guest')
        if (searchParamsAndUserId.email_guest) validate.string(searchParamsAndUserId.email_guest, 'email guest')
        if (searchParamsAndUserId.deployment) validate.string(searchParamsAndUserId.deployment, 'deployment')

        return (async () => {
            const keys = await Key.find(searchParamsAndUserId, { __v: 0 }).lean()
            if (!keys) throw Error('no results')

            return keys.map(key => {
                key.id = key._id.toString()
                delete key._id
                key.deployment = key.deployment._id.toString()
                delete key.deployment._id
                key.user = key.user._id.toString()
                delete key.user._id
                return key
            })

        })()
    }