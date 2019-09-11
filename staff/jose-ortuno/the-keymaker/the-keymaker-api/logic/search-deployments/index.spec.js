require('dotenv').config()

const { expect } = require('chai')
const searchKeys = require('./index')
const { database, models: { User, Deployment, Key } } = require('the-keymaker-data')
const { random } = require('the-keymaker-utils')

const { env: { DB_URL_TEST, JWT_SECRET } } = process

describe('logic - search deployments', () => {
    before(() => database.connect(DB_URL_TEST))

    // user
    let alias_user1, email1, password1, userId1, path1
    let alias_user2, email2, password2, userId2, path2

    // deployment
    let alias_deployment1, status1, path3
    let alias_deployment2, status2, path4
    let alias_deployment3, status3, path5
    let alias_deployment4, status4, path6
    let alias_deployment5, status5, path7

    // deployment Skylab
    const longitude = 2.199905
    const latitude = 41.398406

    beforeEach(async () => {
        await User.deleteMany()
        await Deployment.deleteMany()
        // USER
        // user1
        alias_user1 = `alias_user-${random.number(0, 100000)}`
        email1 = `email-${random.number(0, 100000)}@domain.com`
        password1 = `password-${random.number(0, 100000)}`
        path1 = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`


        const user1 = await User.create({ logo: path1, alias: alias_user1, email: email1, password: password1 })
        userId1 = user1.id

        // user2
        alias_user2 = `alias_user-${random.number(0, 100000)}`
        email2 = `email-${random.number(0, 100000)}@domain.com`
        password2 = `password-${random.number(0, 100000)}`
        path2 = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`

        const user2 = await User.create({ logo: path2, alias: alias_user2, email: email2, password: password2 })
        userId2 = user2.id

        // DEPLOYMENT
        // deployment 1
        alias_deployment1 = `alias_deployment-${random.number(0, 100000)}`
        email_deployment1 = `email-${random.number(0, 100000)}@domain.com`
        status1 = random.boolean()
        path3 = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`


        await Deployment.create({ logo: path3, alias: alias_deployment1, status: status1, user: userId1, location: { coordinates: [longitude, latitude] } })

        // deployment 2
        alias_deployment2 = `alias_deployment-${random.number(0, 100000)}`
        email_deployment2 = `email-${random.number(0, 100000)}@domain.com`
        status2 = random.boolean()
        path4 = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`

        await Deployment.create({ logo: path4, alias: alias_deployment2, status: status2, user: userId1, location: { coordinates: [longitude, latitude] } })

        // deployment 3
        alias_deployment3 = `alias_deployment-${random.number(0, 100000)}`
        email_deployment3 = `email-${random.number(0, 100000)}@domain.com`
        status3 = random.boolean()
        path5 = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`

        await Deployment.create({ logo: path5, alias: alias_deployment3, status: status3, user: userId1, location: { coordinates: [longitude, latitude] } })

        // deployment 4
        alias_deployment4 = `alias_deployment-${random.number(0, 100000)}`
        email_deployment4 = `email-${random.number(0, 100000)}@domain.com`
        status4 = random.boolean()
        path6 = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`

        await Deployment.create({logo: path6, alias: alias_deployment4, status: status4, user: userId2, location: { coordinates: [longitude, latitude] } })

        // deployment 5
        alias_deployment5 = `alias_deployment-${random.number(0, 100000)}`
        email_deployment5 = `email-${random.number(0, 100000)}@domain.com`
        status5 = random.boolean()
        path7 = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`

        await Deployment.create({logo: path7,  alias: alias_deployment5, status: status5, user: userId2, location: { coordinates: [longitude, latitude] } })

    })

    it('should succeed on correct data: user 1', async () => {
        const searchParamsAndUserId = {
            alias: alias_deployment1,
            user: userId1
        }
        
        const deployments = await searchKeys(searchParamsAndUserId)
        
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

    it('should succeed on correct data: user 2', async () => {
        const searchParamsAndUserId = {
            alias: alias_deployment5,
            user: userId2
        }
        
        const deployments = await searchKeys(searchParamsAndUserId)
        
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
        const searchParamsAndUserId = {
            alias: 'no exist',
            user: userId1
        }

        try {
            await searchKeys(searchParamsAndUserId)
        } catch ({message}) {
            expect(message).to.equal(`no results`)
        }
    })

    after(() => database.disconnect())
})