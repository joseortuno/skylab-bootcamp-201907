require('dotenv').config()

const { expect } = require('chai')
const updateUser = require('.')
const { database, models: { User } } = require('the-keymaker-data')
const { random } = require('the-keymaker-utils')

const { env: { DB_URL_TEST } } = process

describe('logic - update user', () => {
    before(() => database.connect(DB_URL_TEST))

    // user
    let alias, email, password, userId, body, path

    beforeEach(async () => {
        alias = `alias-${random.number(0, 100000)}`
        email = `email-${random.number(0, 100000)}@domain.com`
        password = `password-${random.number(0, 100000)}`
        path = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`

        body = {
            email: `email-${random.number(0, 100000)}@domain.com`,
            password: `password-${random.number(0, 100000)}`,
        }

        await User.deleteMany()
        const user = await User.create({ logo: path, alias, email, password })
        userId = user.id

    })

    it('should succeed on correct data', async () => {
        
        const result = await updateUser(userId, body)
        expect(result).not.to.exist
        const user = await User.findById(userId)
        expect(user).to.exist
        expect(user.email).to.equal(body.email)
        expect(user.password).to.exist
    })

    it('should fail on non-existing user', async () => {
        userId = '5d5d5530531d455f75da9fF9'
        
        try {
            await updateUser(userId, body)
        } catch ({message}) {
            expect(message).to.equal(`the connection ok, but there are not modifications`)
        }
    })

    it('should fail non-modifiable properties: alias', async () => {
        body = {
            alias: `alias-${random.number(0, 100000)}`
        }
        
        try {
            await updateUser(userId, body)
        } catch ({message}) {
            expect(message).to.equal(`alias non-modifiable`)
        }
    })

    after(() => database.disconnect())
})