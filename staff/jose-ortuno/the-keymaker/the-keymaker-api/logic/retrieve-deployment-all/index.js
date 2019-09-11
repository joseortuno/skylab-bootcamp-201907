const { models: { Deployment } } = require('the-keymaker-data')
const { validate } = require('the-keymaker-utils')

module.exports =
    /**
     * Retrieve deployment all
     * 
     * @param {string} userId
     * 
     * @return {Array} deployments
     * 
     * @throws {Error} param deployment id: user with id deployment does not exist
     * @throws {Error} deployment not found
     */
    function (userId) {
        validate.string(userId, 'user id')

        return (async () => {
            const deployments = await Deployment.find({ user: userId }, { __v: 0 }).lean()
            if (!deployments) throw Error('deployment not found')

            let result = deployments.map(deployment => {
                
                deployment.id = deployment._id.toString()
                
                delete deployment._id
                
                deployment.user = deployment.user._id.toString()
                
                deployment.location = {
                    longitude: deployment.location.coordinates[0],
                    latitude: deployment.location.coordinates[1]
                }
                return deployment
            })
            
            return result
            
        })()
    }