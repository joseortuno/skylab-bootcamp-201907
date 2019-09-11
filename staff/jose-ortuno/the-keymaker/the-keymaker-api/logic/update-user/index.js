const { models: { User } } = require('the-keymaker-data')
const { validate } = require('the-keymaker-utils')
const bcrypt = require('bcryptjs')

module.exports =
    /**
     * Update user: logo (img), alias (string), email (string and email), password (string)
     * 
     * @param {string} userId: User id
     * @param {object} update: update data user
     * 
     * @return {promise}
     * @return {string} Error message: in case that user not exist os is not find
     * @return {number} updateCount: should correct succes in case that user not exist os is not find (range max 1)
     * 
     * @throws {TypeError} param update: second param is empty or is not object
     * @throws {SyntaxError} param update: update object is empty
     * @throws {Error} param update.alias: alias non-modifiable
     * @throws {Error} user with user id does not exist
     * @throws {Error} the connection ok, but there are not modifications
     */
    function (userId, update) {
        validate.string(userId, 'user id')
        if (!(update instanceof Object) || update === undefined) throw TypeError('second param is empty or is not object')
        if (Object.keys(update).length === 0) throw SyntaxError('update object is empty')
        if (update.alias) throw Error('alias non-modifiable')



        return (async () =>{
            if (update.password) {
                const hash = await bcrypt.hash(update.password, 10)
                update.password = hash
            }

            const { nModified, ok } = await User.updateOne({ _id: userId }, { $set: update })
            if (!nModified && !ok) throw Error(`user with id ${userId} does not exist`)
            if (!nModified && ok) throw Error(`the connection ok, but there are not modifications`)
        })()
    }