const { models: { User, Deployment } } = require('the-keymaker-data')
const { validate } = require('the-keymaker-utils')

module.exports =
    /**
     * Register deployment
     * 
     * @param {String} alias 
     * @param {Boolean} status 
     * @param {String} userId
     * @param {Number} longitude
     * @param {Number} latitude
     * 
     * @return {Promises}
     * @return {String} Id deployment
     * 
     * @throws {Error} validate param alias:alias  with value param is not a string
     * @throws {Error} validate param status: status  with value param is not a boolean
     * @throws {Error} validate param userId: user id  with value param is not a string
     * @throws {Error} validate param longitude: longitude with value param is not a number
     * @throws {Error} validate param latitude: latitude  with value param is not a number
     */
    function (logo, alias, address, status, userId, longitude, latitude) {
    
        validate.string(alias, 'alias')
        validate.string(address, 'address')
        validate.boolean(status, 'status')
        validate.string(userId, 'userId')
        validate.number(longitude, 'longitude')
        validate.number(latitude, 'latitude')

        const createdAt = new Date()

        if (logo === undefined) logo = 'https://res.cloudinary.com/dgsndtxtl/image/upload/v1568565363/burninghouse_mesu3s.jpg'

        return (async () => {
            const user = await User.findById(userId)
            if (!user) throw Error('wrong credentials')
            const deployment = await Deployment.findOne({ alias })
            if (deployment) throw Error('alias already registered')


            const getDeployment = await Deployment.create({ created_at: createdAt, logo, alias, status, user: userId, address, location: { coordinates: [longitude, latitude] } })

            return { id: getDeployment.id }
        })()
    }