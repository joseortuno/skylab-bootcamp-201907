const { models: { Deployment } } = require('the-keymaker-data')
const { validate } = require('the-keymaker-utils')

module.exports =
    /**
     * Retrieve deployment
     * 
     * @param {string} deploymentId
     * 
     * @return {Object} deployment
     * 
     * @throws {Error} param deployment id: user with id deployment does not exist
     * @throws {Error} deployment not found
     */
    function (userId, deploymentId) {
        validate.string(deploymentId, 'deployment id')

        return (async () => {
            const deployment = await Deployment.findOne({ _id: deploymentId }, { __v: 0 }).lean()
            if (!deployment) throw Error('deployment not found')

            deployment.id = deployment._id.toString()
            delete deployment._id
            deployment.user = deployment.user._id.toString()
            delete deployment.user._id

            if(deployment.user._id === userId) throw Error('does not have permissions')

            deployment.location = {
                longitude: deployment.location.coordinates[0],
                latitude: deployment.location.coordinates[1]
            }
            return deployment
        })()
    }