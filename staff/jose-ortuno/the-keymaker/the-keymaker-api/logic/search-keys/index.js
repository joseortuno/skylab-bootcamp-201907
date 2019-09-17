const { models: { Key, User } } = require('the-keymaker-data')
const { validate } = require('the-keymaker-utils')

module.exports =
    /**
     * Search key
     * 
     * @param {String} idUser
     * @param {String} query
     * 
     * @return {Array} array keys
     * 
     * @throws {Error} param object search: Input search param is not an Object
     * @throws {Error} Input is empty
     * @throws {Error} param alias guest: alias guest is not a string
     * @throws {Error} param email guest: email guest is not a string
     * @throws {Error} param deployment: deployment is not a string
     */
    function (idUser, query) {
        debugger
        validate.string(idUser, 'idUser')
        validate.string(query, 'query')
        debugger

        return (async () => {
            const user = await User.findById(idUser)
            if (!user) throw Error('wrong credentials')

            const keys = await Key.find({ alias_guest: query, user: idUser }, { __v: 0 }).populate('deployment').lean()
            
            if (keys.length === 0) throw Error('no results')
            
            const result = keys.map(key => {
                if (key._id) {
                    key.id = key._id.toString()
                    delete key._id
                }
                
                if (key.deployment._id) {
                    key.deployment.id = key.deployment._id.toString()
                    delete key.deployment._id
                    delete key.deployment.__v
                }

                key.user = key.user.toString()

                return key
            })

            return result

        })()
    }