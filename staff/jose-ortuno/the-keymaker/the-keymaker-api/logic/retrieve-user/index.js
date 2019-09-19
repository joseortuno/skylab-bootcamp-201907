const { models: { User } } = require('the-keymaker-data')
const { validate } = require('the-keymaker-utils')

module.exports =
    /**
     * Retrieve user
     * 
     * @param {string} id
     * 
     * @return {object} logo (path), alias (string) and  email(email)
     * 
     * @throws {TypeError} validate param userId: user id  with value param is not a string
     */
    function (userId) {
        validate.string(userId, 'user Id')
        
        return (async () => {
            const user = await User.findOne({ _id: userId }, { _id: 0, password: 0, __v: 0 }).lean()

            if (!user) throw Error('Wrong credentials')

            user.id = userId
            return user
        })()
    }