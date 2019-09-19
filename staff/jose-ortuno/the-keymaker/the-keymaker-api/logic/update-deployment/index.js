const { models: { Deployment, User } } = require('the-keymaker-data')
const { validate } = require('the-keymaker-utils')

module.exports =
    /**
     * Update deployment: status (booblean)
     * 
     * @param {string} id: User id
     * @param {object} update: update data user
     * 
     * @return {promise}
     * 
     * @throws {Error} param deployment id: 
     * @throws {TypeError} param update: second param is empty or is not object
     * @throws {SyntaxError} param update: update object is empty
     * 
     */
    function (userId, deploymentId, update) {
        validate.string(userId, 'user id')
        validate.string(deploymentId, 'deployment id')
        if (!(update instanceof Object) || update === undefined) throw TypeError('second param is empty or is not object')
        if (Object.keys(update).length === 0) throw SyntaxError('update object is empty')

        if (update.status) validate.boolean(update.status, 'status')

        if (update.location || update.user || update.id || update.logo) throw Error('non modificable field')
        
        return (async () =>{
            const user = await User.findById(userId)
            if(!user) throw new Error('wrong user credentials')

            const { nModified, ok } = await Deployment.updateOne({ _id: deploymentId }, { $set: update })
            if (!nModified && !ok) throw Error(`deployment with id ${deploymentId} does not exist`)
        })()
    }