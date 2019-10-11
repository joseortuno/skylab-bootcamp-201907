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
    let alias_deployment, status, deploymentId, createdAt = new Date()

    // guest
    let alias_guest, email_guest

    const alias_guest1 = `joselito`
    const email_guest1 = `xossse@gmail.com`
    
    const alias_guest2 = `jose`
    const email_guest2 = `joseantortunorioja@gmail.com`

    // date key 0.1
    let validFrom = new Date('2019-09-06 11:00:00')
    let validUntil = new Date('2019-09-06 12:00:00')

    // date key 0.2
    let validFromA = new Date('2019-09-06 11:00:00')
    let validUntilA = new Date('2019-09-06 12:00:00')

    // date key 0.3
    let validFromB = new Date('2019-09-06 10:30:00')
    let validUntilB = new Date('2019-09-06 12:30:00')

    // date key 0.4
    let validFromC = new Date('2019-09-06 10:30:00')
    let validUntilC = new Date('2019-09-06 11:30:00')
 
    // date key 0.5
    let validFromD = new Date('2019-09-06 10:30:00')
    let validUntilD = new Date('2019-09-06 12:30:00')
    
    // date key 0.6
    let validFromE = new Date('2019-09-06 11:00:00')
    let validUntilE = new Date('2019-09-06 12:00:00')

    // date key 1
    let validFrom1 = new Date('2019-09-06 12:01:00')
    let validUntil1 = new Date('2019-09-06 13:00:00')

    // date key 2
    let validFrom2 = new Date('2019-09-06 11:30:00')
    let validUntil2 = new Date('2019-09-06 12:30:00')

    // date key 3
    let validFrom3 = new Date('2019-09-06 11:59:00')
    let validUntil3 = new Date('2019-09-06 12:30:00')

    // deployment Skylab
    const longitude = 2.199905
    const latitude = 41.398406
    const logo = 'https://res.cloudinary.com/dgsndtxtl/image/upload/v1568565363/burninghouse_mesu3s.jpg'

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
        const deployment = await Deployment.create({ created_at: createdAt, logo, alias: alias_deployment, address: address_deployment, status, user: userId, location: { coordinates: [longitude, latitude] } })
        deploymentId = deployment.id

        // guest random
        alias_guest = `alias_guest-${random.number(0, 100000)}`
        email_guest = `email_guest-${random.number(0, 100000)}@domain.com`

        await Key.deleteMany()

    })
    
    it('should succeed on correct data', async () => {
        
        const { id, token, email } = await registerKey(validFrom, validUntil, alias_guest, email_guest, deploymentId, userId)
        expect(id).to.exist
        expect(token).to.exist
        expect(email).to.exist
        
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

    it('should succeed by sending two keys in adjacent hours', async () => {
        // Key 1
        const { id: idKey1, token: tokenKey1, email } = await registerKey(validFrom, validUntil, alias_guest, email_guest, deploymentId, userId)
    
        expect(idKey1).to.exist
        expect(tokenKey1).to.exist
        expect(email).to.exist
        
        const key1 = await Key.findOne({ _id: idKey1 })

        expect(key1).to.exist
        expect(key1.created_at).to.exist
        expect(key1.valid_from.toString()).to.equal(validFrom.toString())
        expect(key1.valid_until.toString()).to.equal(validUntil.toString())
        expect(key1.token).to.equal(tokenKey1)
        expect(key1.used_at).to.be.undefined
        expect(key1.canceled).to.be.undefined
        expect(key1.status).to.be.equal('waiting')
        expect(key1.alias_guest).to.equal(alias_guest)
        expect(key1.email_guest).to.equal(email_guest)
        expect(key1.deployment._id.toString()).to.equal(deploymentId)
        expect(key1.user._id.toString()).to.equal(userId)

        // Key 2
        const { id: idKey2, token: tokenKey2, email: _email } = await registerKey(validFrom1, validUntil1, alias_guest, email_guest, deploymentId, userId)
        
        expect(idKey2).to.exist
        expect(tokenKey2).to.exist
        expect(_email).to.exist
        
        const key2 = await Key.findOne({ _id: idKey2 })

        expect(key2).to.exist
        expect(key2.created_at).to.exist
        expect(key2.valid_from.toString()).to.equal(validFrom1.toString())
        expect(key2.valid_until.toString()).to.equal(validUntil1.toString())
        expect(key2.token).to.equal(tokenKey2)
        expect(key2.used_at).to.be.undefined
        expect(key2.canceled).to.be.undefined
        expect(key2.status).to.be.equal('waiting')
        expect(key2.alias_guest).to.equal(alias_guest)
        expect(key2.email_guest).to.equal(email_guest)
        expect(key2.deployment._id.toString()).to.equal(deploymentId)
        expect(key2.user._id.toString()).to.equal(userId)
    })

    it('should not succeed by sending two keys at equal times 1', async () => {
        // Key 1
        const { id: idKey1, token: tokenKey1, email } = await registerKey(validFrom, validUntil, alias_guest, email_guest, deploymentId, userId)
    
        expect(idKey1).to.exist
        expect(tokenKey1).to.exist
        expect(email).to.exist
        
        const key1 = await Key.findOne({ _id: idKey1 })

        expect(key1).to.exist
        expect(key1.created_at).to.exist
        expect(key1.valid_from.toString()).to.equal(validFrom.toString())
        expect(key1.valid_until.toString()).to.equal(validUntil.toString())
        expect(key1.token).to.equal(tokenKey1)
        expect(key1.used_at).to.be.undefined
        expect(key1.canceled).to.be.undefined
        expect(key1.status).to.be.equal('waiting')
        expect(key1.alias_guest).to.equal(alias_guest)
        expect(key1.email_guest).to.equal(email_guest)
        expect(key1.deployment._id.toString()).to.equal(deploymentId)
        expect(key1.user._id.toString()).to.equal(userId)
        
        // Key 2
        
        try {
            await registerKey(validFrom2, validUntil2, alias_guest, email_guest, deploymentId, userId)
        } catch ({ message}) {
            expect(message).to.equal('sorry, the requested time slot is busy')
        }
    })

    it('should not succeed by sending two keys at equal times 2', async () => {
        // Key 1
        const { id: idKey1, token: tokenKey1, email } = await registerKey(validFrom, validUntil, alias_guest, email_guest, deploymentId, userId)
    
        expect(idKey1).to.exist
        expect(tokenKey1).to.exist
        expect(email).to.exist
        
        const key1 = await Key.findOne({ _id: idKey1 })

        expect(key1).to.exist
        expect(key1.created_at).to.exist
        expect(key1.valid_from.toString()).to.equal(validFrom.toString())
        expect(key1.valid_until.toString()).to.equal(validUntil.toString())
        expect(key1.token).to.equal(tokenKey1)
        expect(key1.used_at).to.be.undefined
        expect(key1.canceled).to.be.undefined
        expect(key1.status).to.be.equal('waiting')
        expect(key1.alias_guest).to.equal(alias_guest)
        expect(key1.email_guest).to.equal(email_guest)
        expect(key1.deployment._id.toString()).to.equal(deploymentId)
        expect(key1.user._id.toString()).to.equal(userId)
        
        // Key 2
        
        try {
            await registerKey(validFrom3, validUntil3, alias_guest, email_guest, deploymentId, userId)
        } catch ({ message}) {
            expect(message).to.equal('sorry, the requested time slot is busy')
        }
    })

    it('should send an email with the key', async () => {
        
        const { id, token, email } = await registerKey(validFrom, validUntil, alias_guest1, email_guest1, deploymentId, userId)
        
        expect(id).to.exist
        expect(token).to.exist
        expect(email).to.equal('email sent correctly')

        const { id: _id, token: _token, email: _email } = await registerKey(validFrom1, validUntil1, alias_guest2, email_guest2, deploymentId, userId)
        
        expect(_id).to.exist
        expect(_token).to.exist
        expect(_email).to.equal('email sent correctly')
        
    })

    it('should match on time: error A', async () => {
        debugger
        await registerKey(validFrom, validUntil, alias_guest1, email_guest1, deploymentId, userId)
        debugger
        try {
            await registerKey(validFromA, validUntilA, alias_guest1, email_guest1, deploymentId, userId)
        } catch ({message}) {
            debugger
            expect(message).to.equal('sorry, the requested time slot is busy')
        }

    })

    it('should match on time: error B', async () => {
        debugger
        await registerKey(validFrom, validUntil, alias_guest1, email_guest1, deploymentId, userId)
        debugger
        try {
            await registerKey(validFromB, validUntilB, alias_guest1, email_guest1, deploymentId, userId)
        } catch ({message}) {
            expect(message).to.equal('sorry, the requested time slot is busy')
        }

    })

    it('should match on time: error C', async () => {
        debugger
        await registerKey(validFrom, validUntil, alias_guest1, email_guest1, deploymentId, userId)
        debugger
        try {
            await registerKey(validFromC, validUntilC, alias_guest1, email_guest1, deploymentId, userId)
        } catch ({message}) {
            expect(message).to.equal('sorry, the requested time slot is busy')
        }

    })

    it('should match on time: error D', async () => {
        debugger
        await registerKey(validFrom, validUntil, alias_guest1, email_guest1, deploymentId, userId)
        debugger
        try {
            await registerKey(validFromD, validUntilD, alias_guest1, email_guest1, deploymentId, userId)
        } catch ({message}) {
            expect(message).to.equal('sorry, the requested time slot is busy')
        }

    })

    it('should match on time: error E', async () => {
        debugger
        await registerKey(validFrom, validUntil, alias_guest1, email_guest1, deploymentId, userId)
        try {
            await registerKey(validFromE, validUntilE, alias_guest1, email_guest1, deploymentId, userId)
        } catch ({message}) {
            expect(message).to.equal('sorry, the requested time slot is busy')
        }

    })


    after(() => database.disconnect())
})