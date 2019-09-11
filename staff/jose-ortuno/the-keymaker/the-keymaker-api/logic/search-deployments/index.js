const { models: { Deployment } } = require('the-keymaker-data')
const { validate } = require('the-keymaker-utils')

module.exports =
    /**
     * Search deployments
     * 
     * @param {String} searchParamsAndUserId
     * 
     * @return {Array} array keys
     * 
     * @throws {Error} param object search: Input search param is not an Object
     * @throws {Error} Input is empty
     * @throws {Error} param alias deployment: alias deployment is not a string
     */
    function (searchParamsAndUserId) {
        validate.string(searchParamsAndUserId.alias, 'alias deployment')

        return (async () => {
            const deployments = await Deployment.find(searchParamsAndUserId, { __v: 0 }).lean()
            if (!deployments) throw Error('no results')

            return deployments.map(deployment => {
                deployment.id = deployment._id.toString()
                delete deployment._id
                deployment.user = deployment.user._id.toString()
                delete deployment.user._id
                return deployment
            })

        })()
    }