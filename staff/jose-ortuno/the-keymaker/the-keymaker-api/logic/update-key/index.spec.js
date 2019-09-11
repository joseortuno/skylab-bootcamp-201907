require('dotenv').config()

const { expect } = require('chai')
const updateKey = require('./index')
const { database, models: { Deployment, Key, User } } = require('the-keymaker-data')
const { random } = require('the-keymaker-utils')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const { env: { DB_URL_TEST, JWT_SECRET } } = process

describe('logic - update key', () => {
    before(() => database.connect(DB_URL_TEST))

    // user
    let alias_user, email, password, userId, path

    // deployment
    let alias_deployment, status, deploymentId

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
        email_deployment = `email-${random.number(0, 100000)}@domain.com`
        status = random.boolean()

        await Deployment.deleteMany()
        const deployment = await Deployment.create({ alias: alias_deployment, status, user: userId, location: { coordinates: [longitude, latitude] } })
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

    it('should succeed on correct data: visited', async () => {

        const update = {
            used_at: moment(new Date('2026-09-06 11:11:00')),
            status: 'visited'
        }

        const result = await updateKey(keyId, update)
        expect(result).not.to.exist

        const key = await Key.findById(keyId)
        expect(key).to.exist
        expect(key.used_at).to.exist
        expect(key.canceled).to.not.exist
        expect(key.status).to.equal(update.status)
        
    })

    it('should succeed on correct data: cancelled', async () => {

        const update = {
            canceled: moment(new Date('2026-09-06 11:11:00')),
            status: 'cancelled'
        }

        const result = await updateKey(keyId, update)
        expect(result).not.to.exist

        const key = await Key.findById(keyId)
        expect(key).to.exist
        expect(key.used_at).to.not.exist
        expect(key.canceled).to.exist
        expect(key.status).to.equal(update.status)
        
    })

    it('should fail on non-content to updater', async () => {
        const update = { }
        
        try {
            updateKey(deploymentId, update)
        } catch ({message}) {
            expect(message).to.equal(`update object is empty`)
        }
    })

    it('should fail on non-existing key', async () => {
        keyId = '5d5d5530531d455f75da9fF9'

        const update = {
            canceled: moment(new Date('2026-09-06 11:11:00')),
            status: 'cancelled'
        }
        
        try {
            updateKey(deploymentId, update)
        } catch ({message}) {
            expect(message).to.equal(`key with id ${keyId} does not exist`)
        }
    })

    after(() => database.disconnect())
})