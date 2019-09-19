require('dotenv').config()

const { expect } = require('chai')
const retrieveKeyAll = require('./index')
const { database, models: { User, Deployment, Key } } = require('the-keymaker-data')
const { random } = require('the-keymaker-utils')
const moment = require('moment')
const jwt = require('jsonwebtoken')

const { env: { DB_URL_TEST, JWT_SECRET } } = process

describe('logic - retrieve key all', () => {
    before(() => database.connect(DB_URL_TEST))

    // user
    let alias_user1, email1, password1, userId1, path1
    let alias_user2, email2, password2, userId2, path2

    // deployment
    let alias_deployment1, address_deployment1, status1, deploymentId1
    let alias_deployment2, address_deployment2, status2, deploymentId2

    // deployment #1 Skylab
    const longitude1 = 2.199905
    const latitude1 = 41.398406

    // deployment #2 taller esquina Skylab
    const longitude2 = 2.20027
    const latitude2 = 41.398260

    // Intervalo tiempo visita
    let validFrom1 = new Date('2018-09-06 11:04:00')
    let validUntil1 = new Date('2026-09-06 11:11:00')
    let validFrom2 = new Date('2018-09-06 11:04:00')
    let validUntil2 = new Date('2026-09-06 11:11:00')
    let validFrom3 = new Date('2018-09-06 11:04:00')
    let validUntil3 = new Date('2026-09-06 11:11:00')
    let validFrom4 = new Date('2018-09-06 11:04:00')
    let validUntil4 = new Date('2026-09-06 11:11:00')

    // date
    let date1, createdAt1, getValidFrom1, getValidUntil1, from1, expiry1
    let date2, createdAt2, getValidFrom2, getValidUntil2, from2, expiry2
    let date3, createdAt3, getValidFrom3, getValidUntil3, from3, expiry3
    let date4, createdAt4, getValidFrom4, getValidUntil4, from4, expiry4

    // key
    let _token1, _token2, _token3, _token4

    beforeEach(async () => {
        /****************************************************************
        USER
        ****************************************************************/
        await User.deleteMany()
        
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

        /****************************************************************
        DEPLOYMENT
        ****************************************************************/
        await Deployment.deleteMany()
        
        // deployment1

        alias_deployment1 = `alias_deployment-${random.number(0, 100000)}`
        address_deployment1 = `address-${random.number(0, 100000)}`
        status1 = random.boolean()

        const deployment1 = await Deployment.create({ created_at: new Date(), alias: alias_deployment1, address: address_deployment1, status: status1, user: userId1, location: { coordinates: [longitude1, latitude1] } })
        deploymentId1 = deployment1.id

        // deployment2
        alias_deployment2 = `alias_deployment-${random.number(0, 100000)}`
        address_deployment2 = `address-${random.number(0, 100000)}`
        status2 = random.boolean()

        const deployment2 = await Deployment.create({ created_at: new Date(), alias: alias_deployment2, address: address_deployment2, status: status2, user: userId2, location: { coordinates: [longitude2, latitude2] } })
        deploymentId2 = deployment2.id

        /****************************************************************
        KEY
        ****************************************************************/
        await Key.deleteMany()
        
        // key1 - user 1 - deployment 1
        alias_guest1 = `alias_guest-${random.number(0, 100000)}`
        email_guest1 = `email_guest-${random.number(0, 100000)}@domain.com`

        /* transform date */
        date1 = new Date()
        createdAt1 = moment(date1)
        getValidFrom1 = moment(validFrom1)
        getValidUntil1 = moment(validUntil1)
        from1 = getValidFrom1.diff(createdAt1, 'seconds')
        expiry1 = getValidUntil1.diff(createdAt1, 'seconds')

        // key create
        const key1 = await Key.create({ created_at: createdAt1, valid_from: validFrom1, valid_until: validUntil1, status: 'waiting', alias_guest: alias_guest1, email_guest: email_guest1, deployment: deploymentId1, user: userId1 })

        // create token
        _token1 = await jwt.sign({
            sub: key1._id.toString()
        }, JWT_SECRET, {
                notBefore: from1,
                expiresIn: expiry1
            })
        // insert token in key
        const update1 = { token: _token1 }
        await Key.updateOne({ _id: key1._id.toString() }, { $set: update1 })

        // key2 - user 1 - deployment 2
        alias_guest2 = `alias_guest-${random.number(0, 100000)}`
        email_guest2 = `email_guest-${random.number(0, 100000)}@domain.com`

        /* transform date */
        date2 = new Date()
        createdAt2 = moment(date2)
        getValidFrom2 = moment(validFrom2)
        getValidUntil2 = moment(validUntil2)
        from2 = getValidFrom2.diff(createdAt2, 'seconds')
        expiry2 = getValidUntil2.diff(createdAt2, 'seconds')

        // key create
        const key2 = await Key.create({ created_at: createdAt2, valid_from: validFrom2, valid_until: validUntil2, status: 'waiting', alias_guest: alias_guest2, email_guest: email_guest2, deployment: deploymentId2, user: userId1 })

        // create token
        _token2 = await jwt.sign({
            sub: key2._id.toString()
        }, JWT_SECRET, {
                notBefore: from2,
                expiresIn: expiry2
            })
        // insert token in key
        const update2 = { token: _token2 }
        await Key.updateOne({ _id: key2._id.toString() }, { $set: update2 })

        // key3 - user 2 - deployment 1
        alias_guest3 = `alias_guest-${random.number(0, 100000)}`
        email_guest3 = `email_guest-${random.number(0, 100000)}@domain.com`

        /* transform date */
        date3 = new Date()
        createdAt3 = moment(date3)
        getValidFrom3 = moment(validFrom3)
        getValidUntil3 = moment(validUntil3)
        from3 = getValidFrom3.diff(createdAt3, 'seconds')
        expiry3 = getValidUntil3.diff(createdAt3, 'seconds')

        // key create
        const key3 = await Key.create({ created_at: createdAt3, valid_from: validFrom3, valid_until: validUntil3, status: 'waiting', alias_guest: alias_guest3, email_guest: email_guest3, deployment: deploymentId1, user: userId2 })

        // create token
        _token3 = await jwt.sign({
            sub: key3._id.toString()
        }, JWT_SECRET, {
                notBefore: from3,
                expiresIn: expiry3
            })
        // insert token in key
        const update3 = { token: _token3 }
        await Key.updateOne({ _id: key3._id.toString() }, { $set: update3 })

        // key4 - user 2 - deployment 2
        alias_guest4 = `alias_guest-${random.number(0, 100000)}`
        email_guest4 = `email_guest-${random.number(0, 100000)}@domain.com`

        /* transform date */
        date4 = new Date()
        createdAt4 = moment(date4)
        getValidFrom4 = moment(validFrom4)
        getValidUntil4 = moment(validUntil4)
        from4 = getValidFrom4.diff(createdAt4, 'seconds')
        expiry4 = getValidUntil4.diff(createdAt4, 'seconds')

        // key create
        const key4 = await Key.create({ created_at: createdAt4, valid_from: validFrom4, valid_until: validUntil4, status: 'waiting', alias_guest: alias_guest4, email_guest: email_guest4, deployment: deploymentId2, user: userId2 })

        // create token
        _token4 = await jwt.sign({
            sub: key4._id.toString()
        }, JWT_SECRET, {
                notBefore: from4,
                expiresIn: expiry4
            })
        // insert token in key
        const update4 = { token: _token4 }
        await Key.updateOne({ _id: key4._id.toString() }, { $set: update4 })

    })

    it('should succeed on correct data: user 1', async () => {
        const alias_guest = [alias_guest1, alias_guest2]
        const email_guest = [email_guest1, email_guest2]
        
        const keys = await retrieveKeyAll(userId1)
        
        keys.forEach((key, index) => {
            expect(key).to.exist
            expect(key.created_at).to.exist
            expect(key.valid_from).to.exist
            expect(key.valid_until).to.exist
            expect(key.status).to.equal('waiting')
            expect(key.alias_guest).to.equal(alias_guest[index])
            expect(key.email_guest).to.equal(email_guest[index])
            expect(key.deployment).to.exist
            expect(key.user).to.equal(userId1)
        })
    })

    it('should succeed on correct data: user 2', async () => {
        const alias_guest = [alias_guest3, alias_guest4]
        const email_guest = [email_guest3, email_guest4]
        const keys = await retrieveKeyAll(userId2)

        keys.forEach((key, index) => {
            expect(key).to.exist
            expect(key.created_at).to.exist
            expect(key.valid_from).to.exist
            expect(key.valid_until).to.exist
            expect(key.status).to.equal('waiting')
            expect(key.alias_guest).to.equal(alias_guest[index])
            expect(key.email_guest).to.equal(email_guest[index])
            expect(key.deployment).to.exist
            expect(key.user).to.equal(userId2)
        })

    })

    after(() => database.disconnect())
})