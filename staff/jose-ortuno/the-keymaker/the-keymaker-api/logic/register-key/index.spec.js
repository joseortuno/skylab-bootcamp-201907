require('dotenv').config()

const { expect } = require('chai')
const registerKey = require('./index')
const { database, models: { User, Key, Deployment } } = require('the-keymaker-data')
const { random } = require('the-keymaker-utils')

const { env: { DB_URL_TEST } } = process

describe('logic - register key', () => {
    before(() => database.connect(DB_URL_TEST))

    // user
    let alias_user, email, password, userId

    // deployment
    let alias_deployment, status, deploymentId

    // date key
    let validFrom = new Date('2019-09-06 11:04:00')
    let validUntil = new Date('2019-09-06 11:11:00')

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
        email_deployment = `email-${random.number(0, 100000)}@domain.com`
        status = random.boolean()

        await Deployment.deleteMany()
        const deployment = await Deployment.create({ alias: alias_deployment, status, user: userId, location: { coordinates: [longitude, latitude] } })
        deploymentId = deployment.id

        // key
        alias_guest = `alias_guest-${random.number(0, 100000)}`
        email_guest = `email_guest-${random.number(0, 100000)}@domain.com`

        await Key.deleteMany()

    })

    it('should succeed on correct data', async () => {
        const { id, token } = await registerKey(validFrom, validUntil, alias_guest, email_guest, deploymentId, userId)
        expect(id).to.exist
        expect(token).to.exist
        
        const key = await Key.findOne({ _id: id })

        expect(key).to.exist
        expect(key.created_at).to.exist
        expect(key.valid_from.toString()).to.equal(validFrom.toString())
        expect(key.valid_until.toString()).to.equal(validUntil.toString())
        expect(key.token).to.equal(token)
        expect(key.used_at).to.be.undefined
        expect(key.canceled).to.be.undefined
        expect(key.status).to.be.equal('waiting')
        expect(key.alias_guest).to.equal(alias_guest)
        expect(key.email_guest).to.equal(email_guest)
        expect(key.deployment._id.toString()).to.equal(deploymentId)
        expect(key.user._id.toString()).to.equal(userId)
    })

    after(() => database.disconnect())
})