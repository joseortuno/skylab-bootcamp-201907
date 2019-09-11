require('dotenv').config()

const { expect } = require('chai')
const retrieveUser = require('.')
const { database, models: { User } } = require('the-keymaker-data')
const { random } = require('the-keymaker-utils')

const { env: { DB_URL_TEST } } = process

describe('logic - retrieve user', () => {
    before(() => database.connect(DB_URL_TEST))

    // user
    let alias, email, password, path, userId

    beforeEach(async () => {
        // user
        alias = `alias-${random.number(0, 100000)}`
        email = `email-${random.number(0, 100000)}@domain.com`
        password = `password-${random.number(0, 100000)}`
        path = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`

        await User.deleteMany()
        const user = await User.create({ logo: path, alias, email, password })
        userId = user.id
    })

    it('should succeed on correct data', async () => {
        const user = await retrieveUser(userId)
        
        expect(user).to.exist
        expect(user.id).to.equal(userId)
        expect(user._id).not.to.exist
        expect(user.alias).to.equal(alias)
        expect(user.email).to.equal(email)
        expect(user.logo).to.equal(path)
        expect(user.password).not.to.exist
    })

    after(() => database.disconnect())
})