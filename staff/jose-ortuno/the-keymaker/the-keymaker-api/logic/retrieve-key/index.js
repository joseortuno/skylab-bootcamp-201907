const { models: { Key } } = require('the-keymaker-data')
const { validate } = require('the-keymaker-utils')

module.exports =
    /**
     * Retrieve key
     * 
     * @param {String} deploymentId
     * 
     * @return {Array} array keys
     * 
     * @throws {Error} param key id: user with id key does not exist
     * @throws {Error} key not found
     */
    function (keyId) {
        validate.string(keyId, 'key id')
        
        return (async () => {
            const key = await Key.findOne({ _id: keyId }, { __v: 0 }).populate('deployment').lean()
            if (!key) throw Error('key not found')
            
            key.id = key._id.toString()
            delete key._id
            key.deployment = key.deployment._id.toString()
            delete key.deployment._id
            delete key.deployment.__v
            key.user = key.user._id.toString()
            delete key.user._id      

            return key
        })()
    }