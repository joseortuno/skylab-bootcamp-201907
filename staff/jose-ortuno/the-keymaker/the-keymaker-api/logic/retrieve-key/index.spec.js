require('dotenv').config()

const { expect } = require('chai')
const retrieveKey = require('./index')
const { database, models: { User, Deployment, Key } } = require('the-keymaker-data')
const { random } = require('the-keymaker-utils')
const moment = require('moment')
const jwt = require('jsonwebtoken')

const { env: { DB_URL_TEST, JWT_SECRET } } = process

describe('logic - retrieve key', () => {
    before(() => database.connect(DB_URL_TEST))

    // user
    let alias_user, email, password, userId, path

    // deployment
    let alias_deployment, address_deployment, status, deploymentId

    // deployment Skylab
    const longitude = 2.199905
    const latitude = 41.398406

    // Intervalo tiempo visita
    let validFrom = new Date('2018-09-06 11:04:00')
    let validUntil = new Date('2026-09-06 11:11:00')

    // date
    let date, createdAt, getValidFrom, getValidUntil, from, expiry

    // key
    let _token, keyId

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
        const deployment = await Deployment.create({ created_at: new Date(), alias: alias_deployment, address: address_deployment, status, user: userId, location: { coordinates: [longitude, latitude] } })
        deploymentId = deployment.id

        // key
        alias_guest = `alias_guest-${random.number(0, 100000)}`
        email_guest = `email_guest-${random.number(0, 100000)}@domain.com`

        await Key.deleteMany()

        /* transform date */
        date = new Date()
        createdAt = moment(date)
        getValidFrom = moment(validFrom)
        getValidUntil = moment(validUntil)
        from = getValidFrom.diff(createdAt, 'seconds')
        expiry = getValidUntil.diff(createdAt, 'seconds')

        // key create
        const key = await Key.create({ created_at: createdAt, valid_from: validFrom, valid_until: validUntil, status: 'waiting', alias_guest, email_guest, deployment: deploymentId, user: userId })
        keyId = key._id.toString()

        // create token
        _token = await jwt.sign({
            sub: key._id.toString()
        }, JWT_SECRET, {
                notBefore: from,
                expiresIn: expiry
            })
        // insert token in key
        const update = { token: _token }
        await Key.updateOne({ _id: key._id.toString() }, { $set: update })
        
        
    })

    it('should succeed on correct data', async () => {
        const key = await retrieveKey(keyId)
        expect(key).to.exist
        expect(key.created_at).to.exist
        expect(key.valid_from).to.exist
        expect(key.valid_until).to.exist
        expect(key.status).to.equal('waiting')
        expect(key.alias_guest).to.equal(alias_guest)
        expect(key.email_guest).to.equal(email_guest)
        expect(key.deployment).to.equal(deploymentId)
        expect(key.user).to.equal(userId)

    })

    after(() => database.disconnect())
})