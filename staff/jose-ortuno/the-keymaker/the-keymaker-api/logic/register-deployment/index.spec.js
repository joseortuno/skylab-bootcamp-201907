require('dotenv').config()

const { expect } = require('chai')
const registerDeployment = require('./index')
const { database, models: { User, Deployment } } = require('the-keymaker-data')
const { random } = require('the-keymaker-utils')

const { env: { DB_URL_TEST } } = process

describe('logic - register deployment', () => {
    before(() => database.connect(DB_URL_TEST))

    // user
    let alias_user, email, password, path, userId

    // deployment
    let alias_deployment, status

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
        status = random.boolean()

        await Deployment.deleteMany()
    })

    it('should succeed on correct data', async () => {

        const response = await registerDeployment(path, alias_deployment, status, userId, longitude, latitude)
        expect(response).to.exist

        const deployment = await Deployment.findOne({ _id: response.id })
        expect(deployment).to.exist
        expect(deployment.logo).to.equal(path)
        expect(deployment.id).to.equal(response.id)
        expect(deployment.alias).to.equal(alias_deployment)
        expect(deployment.status).to.equal(status)
        expect(deployment.user.toString()).to.equal(userId)

    })

    after(() => database.disconnect())
})