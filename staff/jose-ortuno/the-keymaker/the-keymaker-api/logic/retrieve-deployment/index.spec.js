require('dotenv').config()

const { expect } = require('chai')
const retrieveDeployment = require('.')
const { database, models: { User, Deployment } } = require('the-keymaker-data')
const { random } = require('the-keymaker-utils')

const { env: { DB_URL_TEST } } = process

describe('logic - retrieve deployment', () => {
    before(() => database.connect(DB_URL_TEST))

    // user
    let alias_user, email, password, userId, path

    // deployment
    let alias_deployment, status, deploymentId

    // deployment Skylab
    const longitude = 2.199905
    const latitude = 41.398406

    beforeEach(async () => {
        // user
        alias_user = `alias_user-${random.number(0, 100000)}`
        email = `email-${random.number(0, 100000)}@domain.com`
        password = `password-${random.number(0, 100000)}`
        path = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`

        await User.deleteMany()
        const user = await User.create({ logo: path, alias: alias_user, email, password })
        userId = user.id

        // deployment
        alias_deployment = `alias_deployment-${random.number(0, 100000)}`
        address_deployment = `address-${random.number(0, 100000)}`
        status = random.boolean()

        await Deployment.deleteMany()
        const deployment = await Deployment.create({created_at: new Date(), alias: alias_deployment, address: address_deployment, status, user: userId, location: { coordinates: [longitude, latitude] } })
        
        deploymentId = deployment.id
        
    })

    it('should succeed on correct data', async () => {

        const deployment = await retrieveDeployment(userId, deploymentId)

        expect(deployment).to.exist
        expect(deployment.alias).to.equal(alias_deployment)
        expect(deployment.status).to.equal(status)
        expect(deployment.user).to.equal(userId)
        expect(deployment.id).to.exist
        expect(deployment.location).to.exist

    })

    it('should succeed on correct data: longitude, latitude', async () => {
        const deployment = await retrieveDeployment(userId, deploymentId)

        expect(deployment.location).to.exist
        const { location: { longitude: long, latitude: lat } } = deployment
        expect(long).to.equal(longitude)
        expect(lat).to.equal(latitude)
        
    })

    after(() => database.disconnect())
})