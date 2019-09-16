require('dotenv').config()

const { expect } = require('chai')
const searchDeployments = require('./index')
const { database, models: { User, Deployment, Key } } = require('the-keymaker-data')
const { random } = require('the-keymaker-utils')

const { env: { DB_URL_TEST } } = process

describe.only('logic - search deployments', () => {
    before(() => database.connect(DB_URL_TEST))

    // user
    let alias_user, email, password, userId, path

    // deployment
    let alias_deployment1, status1, path1
    let alias_deployment2, status2, path2
    let alias_deployment3, status3, path3
    let alias_deployment4, status4, path4
    let alias_deployment5, status5, path5

    // deployment Skylab
    const longitude = 2.199905
    const latitude = 41.398406

    beforeEach(async () => {
        await User.deleteMany()
        await Deployment.deleteMany()

        // USER
        // user1
        alias_user = `alias_user-${random.number(0, 100000)}`
        email = `email-${random.number(0, 100000)}@domain.com`
        password = `password-${random.number(0, 100000)}`
        path = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`


        const user = await User.create({ logo: path, alias: alias_user, email: email, password: password })
        userId = user.id

        // DEPLOYMENT
        // deployment 1
        alias_deployment1 = `alias_deployment-${random.number(0, 100000)}`
        email_deployment1 = `email-${random.number(0, 100000)}@domain.com`
        status1 = random.boolean()
        path1 = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`


        await Deployment.create({ logo: path3, alias: alias_deployment1, status: status1, user: userId, location: { coordinates: [longitude, latitude] } })

        // deployment 2
        alias_deployment2 = `alias_deployment-${random.number(0, 100000)}`
        email_deployment2 = `email-${random.number(0, 100000)}@domain.com`
        status2 = random.boolean()
        path2 = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`

        await Deployment.create({ logo: path4, alias: alias_deployment2, status: status2, user: userId, location: { coordinates: [longitude, latitude] } })

        // deployment 3
        alias_deployment3 = `alias_deployment-${random.number(0, 100000)}`
        email_deployment3 = `email-${random.number(0, 100000)}@domain.com`
        status3 = random.boolean()
        path3 = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`

        await Deployment.create({ logo: path5, alias: alias_deployment3, status: status3, user: userId, location: { coordinates: [longitude, latitude] } })

        // deployment 4
        alias_deployment4 = `alias_deployment-${random.number(0, 100000)}`
        email_deployment4 = `email-${random.number(0, 100000)}@domain.com`
        status4 = random.boolean()
        path4 = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`

        await Deployment.create({logo: path6, alias: alias_deployment4, status: status4, user: userId, location: { coordinates: [longitude, latitude] } })

        // deployment 5
        alias_deployment5 = `alias_deployment-${random.number(0, 100000)}`
        email_deployment5 = `email-${random.number(0, 100000)}@domain.com`
        status5 = random.boolean()
        path5 = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`

        await Deployment.create({logo: path7,  alias: alias_deployment5, status: status5, user: userId, location: { coordinates: [longitude, latitude] } })

    })

    it('should succeed on correct data: deployment 1', async () => {
        const query = alias_deployment1
        
        const deployments = await searchDeployments(userId, query)
        
        deployments.forEach(deployment => {
            expect(deployment).to.exist
            expect(deployment.id).to.exist
            expect(deployment.logo).to.equal(path3)
            expect(deployment.alias).to.equal(alias_deployment1)
            expect(deployment.location).to.exist
            expect(deployment.status).to.equal(status1)
            expect(deployment.user).to.equal(userId1)
        })
    })

    it('should succeed on correct data: deployment 2', async () => {
        const query = alias_deployment2
        
        const deployments = await searchDeployments(userId, query)
        
        deployments.forEach(deployment => {
            expect(deployment).to.exist
            expect(deployment.id).to.exist
            expect(deployment.logo).to.equal(path7)
            expect(deployment.alias).to.equal(alias_deployment5)
            expect(deployment.location).to.exist
            expect(deployment.status).to.equal(status5)
            expect(deployment.user).to.equal(userId2)
        })
    })

    it('should succeed no results', async () => {
        const query = 'jhsdashjdj'

        try {
            await searchDeployments(userId, query)
        } catch ({message}) {
            expect(message).to.equal(`no results`)
        }
    })

    it('should succeed query is empty', async () => {
        const query = ''

        try {
            await searchDeployments(userId, query)
        } catch ({message}) {
            expect(message).to.equal(`no results`)
        }
    })

    after(() => database.disconnect())
})