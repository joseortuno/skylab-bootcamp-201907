require('dotenv').config()

const { expect } = require('chai')
const updateDeployment = require('./index')
const { database, models: { Deployment, User } } = require('the-keymaker-data')
const { random } = require('the-keymaker-utils')

const { env: { DB_URL_TEST } } = process

describe('logic - update deployment', () => {
    before(() => database.connect(DB_URL_TEST))

    // user
    let alias_user, email, password, userId, path

    // deployment
    let alias_deployment, address_deployment, status, deploymentId

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
        address_deployment = `addres_deployment-${random.number(0, 100000)}`
        status = random.boolean()

        await Deployment.deleteMany()
        const deployment = await Deployment.create({ created_at: new Date(), logo: path, alias: alias_deployment, address: address_deployment, status, user: userId, location: { coordinates: [longitude, latitude] } })
        deploymentId = deployment.id

    })

    it('should succeed on correct data', async () => {

        const update = {
            status: random.boolean(),
            logo: `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`
        }

        const result = await updateDeployment(deploymentId, update)
        expect(result).not.to.exist

        const deployment = await Deployment.findById(deploymentId)
        expect(deployment).to.exist
        expect(deployment.logo).to.equal(update.logo)
        expect(deployment.status).to.equal(update.status)

    })

    it('should fail on non-content to updater', async () => {
        const update = {}

        try {
            updateDeployment(deploymentId, update)
        } catch ({ message }) {
            expect(message).to.equal(`update object is empty`)
        }
    })

    it('should fail on non-existing deployment', async () => {
        deploymentId = '5d5d5530531d455f75da9fF9'

        const update = {
            status: random.boolean(),
            logo: `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`
        }

        try {
            updateDeployment(deploymentId, update)
        } catch ({ message }) {
            expect(message).to.equal(`deployment with id ${deploymentId} does not exist`)
        }
    })

    after(() => database.disconnect())
})