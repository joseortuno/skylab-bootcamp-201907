const { models: { Deployment, User } } = require('the-keymaker-data')
const { validate } = require('the-keymaker-utils')

module.exports =
    /**
     * Search deployment
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
        validate.string(idUser, 'idUser')
        validate.string(query, 'query')

        return (async () => {
            const user = await User.findById(idUser)
            if (!user) throw Error('wrong credentials')

            const deployments = await Deployment.find({ alias: query, user: idUser }, {__v: 0}).lean()
            if (deployments.length === 0) throw Error('no results')

            return deployments.map(deployment => {
                deployment.id = deployment._id.toString()
                delete deployment._id
                deployment.user = deployment.user._id.toString()
                deployment.location = {
                    longitude: deployment.location.coordinates[0],
                    latitude: deployment.location.coordinates[1]
                }
                return deployment
            })

        })()
    }