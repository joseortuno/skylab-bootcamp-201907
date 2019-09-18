require('dotenv').config()

const { expect } = require('chai')
const searchDeployments = require('./index')
const { database, models: { User, Deployment, Key } } = require('the-keymaker-data')
const { random } = require('the-keymaker-utils')

const { env: { DB_URL_TEST } } = process

describe('logic - search deployments', () => {
    before(() => database.connect(DB_URL_TEST))

    // user
    let alias_user, email, password, userId, path

    // deployment
    let alias_deployment1, status1, path1, deploymentId1
    let alias_deployment2, status2, path2, deploymentId2
    let alias_deployment3, status3, path3, deploymentId3
    let alias_deployment4, status4, path4, deploymentId4

    // deployment Skylab
    const longitude = 2.199905
    const latitude = 41.398406

    beforeEach(async () => {
        await User.deleteMany()
        await Deployment.deleteMany()

        // USER
        alias_user = `alias_user-${random.number(0, 100000)}`
        email = `email-${random.number(0, 100000)}@domain.com`
        password = `password-${random.number(0, 100000)}`
        path = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`


        const user = await User.create({ created_at: new Date(), logo: path, alias: alias_user, email: email, password: password })
        userId = user.id

        // DEPLOYMENT
        // deployment 1
        alias_deployment1 = `alias_deployment-${random.number(0, 100000)}`
        address_deployment1 = `address-${random.number(0, 100000)}`
        status1 = random.boolean()
        path1 = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`

        const deployment1 = await Deployment.create({ created_at: new Date(), logo: path1, alias: alias_deployment1, address: address_deployment1, user: userId, location: { coordinates: [longitude, latitude] }, status: status1 })
        deploymentId1 = deployment1.id

        // deployment 2
        alias_deployment2 = `alias_deployment-${random.number(0, 100000)}`
        address_deployment2 = `address-${random.number(0, 100000)}`
        status2 = random.boolean()
        path2 = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`

        const deployment2 = await Deployment.create({ created_at: new Date(), logo: path2, alias: alias_deployment2, address: address_deployment2, user: userId, location: { coordinates: [longitude, latitude] }, status: status2 })
        deploymentId2 = deployment2.id

        // deployment 3
        alias_deployment3 = `alias_deployment-${random.number(0, 100000)}`
        address_deployment3 = `address-${random.number(0, 100000)}`
        status3 = random.boolean()
        path3 = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`

        const deployment3 = await Deployment.create({ created_at: new Date(), logo: path3, alias: alias_deployment3, address: address_deployment3, user: userId, location: { coordinates: [longitude, latitude] }, status: status3 })
        deploymentId3 = deployment3.id

        // deployment 4
        alias_deployment4 = `alias_deployment-${random.number(0, 100000)}`
        address_deployment4 = `address-${random.number(0, 100000)}`
        status4 = random.boolean()
        path4 = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`

        const deployment4 = await Deployment.create({ created_at: new Date(), logo: path4, alias: alias_deployment4, address: address_deployment4, user: userId, location: { coordinates: [longitude, latitude] }, status: status4 })
        deploymentId4 = deployment4.id

    })

    it('should succeed on correct data: deployment 1', async () => {
        const query = alias_deployment1

        const deployments = await searchDeployments(userId, query)

        deployments.forEach(deployment => {
            expect(deployment).to.exist
            expect(deployment.created_at).to.exist
            expect(deployment.logo).to.equal(path1)
            expect(deployment.id).to.equal(deploymentId1)
            expect(deployment.logo).to.equal(path1)
            expect(deployment.alias).to.equal(alias_deployment1)
            expect(deployment.location).to.exist
            expect(deployment.status).to.equal(status1)
            expect(deployment.user).to.equal(userId)
        })
    })

    it('should succeed on correct data: deployment 2', async () => {
        const query = alias_deployment2

        const deployments = await searchDeployments(userId, query)

        deployments.forEach(deployment => {
            expect(deployment).to.exist
            expect(deployment.created_at).to.exist
            expect(deployment.logo).to.equal(path2)
            expect(deployment.id).to.equal(deploymentId2)
            expect(deployment.logo).to.equal(path2)
            expect(deployment.alias).to.equal(alias_deployment2)
            expect(deployment.location).to.exist
            expect(deployment.status).to.equal(status2)
            expect(deployment.user).to.equal(userId)
        })
    })

    it('should succeed no results', async () => {
        const query = 'jhsdashjdj'

        try {
            await searchDeployments(userId, query)
        } catch ({ message }) {
            expect(message).to.equal(`no results`)
        }
    })

    it('should succeed query is empty', async () => {
        const query = ''

        try {
            await searchDeployments(userId, query)
        } catch ({ message }) {
            expect(message).to.equal(`query is empty or blank`)
        }
    })

    after(() => database.disconnect())
})