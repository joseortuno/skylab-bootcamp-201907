const { models: { Key, Deployment } } = require('the-keymaker-data')
const { validate } = require('the-keymaker-utils')
const { env: { JWT_SECRET } } = process
const jwt = require('jsonwebtoken')


module.exports =
    /**
     * use key: El status en el momento de registro lo marca waiting
     * 
     * @param {Coordinates} longitude 
     * @param {Coordinates} latitude
     * @param {String} token
     * 
     * @return {Promises}
     * @return {id} id deployment visited
     * 
     * @throws {typeError} param token: token with value param is not a string
     */
    function (keyId, longitude, latitude) {
        validate.string(keyId, 'key id')
        validate.string(longitude, 'longitude')
        validate.string(latitude, 'latitude')
        let _longitude = Number(longitude)
        let _latitude = Number(latitude)
        validate.number(_longitude, 'longitude')
        validate.number(_latitude, 'latitude')
        let id

        return (async () => {
            const key = await Key.findById(keyId)
            if (!key) throw Error('key not find')
            if (key.status !== 'waiting') throw Error(`operation not allowed: the state of the key is ${key.status}`)

            const { sub: getKeyId } = jwt.verify(key.token, JWT_SECRET)
            if (keyId !== getKeyId) throw Error('wrong credentials')

            const deployment = await Deployment.findById(key.deployment._id.toString()).lean()
            if (!deployment) throw Error('deployment not find')
            if (deployment.status !== true) throw Error(`operation not allowed: the state of the key is ${deployment.status}`)
            deployment.id = deployment._id.toString()

            const deploymentsNear = await Deployment.find({ location: { $nearSphere: { $geometry: { type: 'Point', coordinates: [_longitude, _latitude] }, $maxDistance: 20 } } }).lean()
            if (!deploymentsNear) throw Error('the operation could not be performed')

            deploymentsNear.forEach(deploymentNear => {
                if (deployment._id.toString() === deploymentNear._id.toString()) id = deploymentNear._id.toString()
            })

            if (id) {
                await Key.updateOne({ _id: keyId }, { $set: { used_at: new Date(), status: 'visited' } })
                return {
                    status: 'open',
                    message: 'key used correctly',
                    deployment: id
                }
            } else {
                return {
                    status: 'close',
                    message: 'door not detected'
                }
            }
        })()
    }