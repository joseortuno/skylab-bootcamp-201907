require('dotenv').config()

const { expect } = require('chai')
const useKey = require('./index')
const { database, models: { User, Key, Deployment } } = require('the-keymaker-data')
const { random } = require('the-keymaker-utils')
const jwt = require('jsonwebtoken')
const moment = require('moment')

const { env: { DB_URL_TEST, JWT_SECRET } } = process

describe('logic - use key', () => {
    before(() => database.connect(DB_URL_TEST))

    let alias_user, email, password, userId, path

    // Deployments
    let alias_deployment, status = true, deploymentId

    // key
    let keyId
    
    // Intervalo tiempo visita
    let validFrom = new Date('2018-09-06 11:04:00')
    let validUntil = new Date('2026-09-06 11:11:00')

    // Deployment Skylab
    const longitude1 = '2.199905'
    const latitude1 = '41.398406'

    // Invitado 1 - Puerta Skylab
    const longitude2 = '2.20004'
    const latitude2 = '41.398538'

    // Invitado 2 - Esquina Skylab
    const longitude3 = '2.20027'
    const latitude3 = '41.398260'

    // Invitado 3 - Calle detrás Skylab
    const longitude4 = '2.199703'
    const latitude4 = '41.398006'

    beforeEach(async () => {
        // user
        alias_user = `alias_user-${random.number(0, 100000)}`
        email = `email-${random.number(0, 100000)}@domain.com`
        password = `password-${random.number(0, 100000)}`
        path = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`
        
        await User.deleteMany()
        const user = await User.create({ logo: path, alias: alias_user, email, password })
        userId = user.id

        // deployment#1
        alias_deployment = `alias_deployment-${random.number(0, 100000)}`
        
        await Deployment.deleteMany()
        const deployment = await Deployment.create({ alias: alias_deployment, status, user: userId, location: { coordinates: [longitude1, latitude1]} })
        deploymentId = deployment.id

        // key
        alias_guest = `alias_guest-${random.number(0, 100000)}`
        email_guest = `email_guest-${random.number(0, 100000)}@domain.com`

        await Key.deleteMany()

        /* transform date */
        const createdAt = moment(new Date())
        const getValidFrom = moment(validFrom)
        const getValidUntil = moment(validUntil)
        const from = getValidFrom.diff(createdAt, 'seconds')
        const expiry = getValidUntil.diff(createdAt, 'seconds')

        // key create
        const key = await Key.create({ created_at: createdAt, valid_from: validFrom, valid_until: validUntil, token: '0', status: 'waiting', alias_guest, email_guest, deployment: deploymentId, user: userId })
        keyId = key._id.toString()

        // create token
        const _token = await jwt.sign({
            sub: key._id.toString()
        }, JWT_SECRET, {
                notBefore: from,
                expiresIn: expiry
            })
        // insert token in key
        const update = { token: _token }
        await Key.updateOne({ _id: key._id.toString() }, { $set: update })
    })

    it('should succeed on correct data: open', async () => {
        const key = await useKey(keyId, longitude2, latitude2)

        expect(key).to.exist
        expect(key.status).to.equal('open')
        expect(key.message).to.equal('key used correctly')
        expect(key.deployment).to.equal(deploymentId)

        const getKey = await Key.findById(keyId)
        expect(getKey.used_at).to.exist
        expect(getKey.status).to.equal('visited')
    })

    it('should succeed on correct data: close', async () => {
        const key  = await useKey(keyId, longitude3, latitude3)

        expect(key).to.exist
        expect(key.status).to.equal('close')
        expect(key.message).to.equal('door not detected')
        expect(key.deployment).to.not.exist

        const getKey = await Key.findById(keyId).lean()
        expect(getKey.used_at).to.not.exist
        expect(getKey.status).to.equal('waiting')
    })

    it('should succeed on correct data: close', async () => {
        const key  = await useKey(keyId, longitude4, latitude4)
        
        expect(key).to.exist
        expect(key.status).to.equal('close')
        expect(key.message).to.equal('door not detected')
        expect(key.deployment).to.not.exist

        const getKey = await Key.findById(keyId).lean()
        expect(getKey.used_at).to.not.exist
        expect(getKey.status).to.equal('waiting')

    })

    after(() => database.disconnect())
})