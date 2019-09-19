const { models: { Key } } = require('the-keymaker-data')
const { validate } = require('the-keymaker-utils')

module.exports =
    /**
     * Retrieve deployment
     * 
     * @param {String} deploymentId
     * 
     * @return {Array} array keys
     * 
     * @throws {Error} param key id: user with id key does not exist
     * @throws {Error} key not found
     */
    function (userId) {
        
        validate.string(userId, 'user id')

        return (async () => {
            const keys = await Key.find({ user: userId }, { __v: 0 }).populate('deployment').lean()
            if (!keys) throw Error('keys not found')

            return keys.map(key => {
                key.id = key._id.toString()
                delete key._id
                
                if (key.deployment._id) {
                    key.deployment.id = key.deployment._id.toString()
                    delete key.deployment._id
                    delete key.deployment.__v
                }

                key.user = key.user.toString()
                
                return key
            })

        })()
    }