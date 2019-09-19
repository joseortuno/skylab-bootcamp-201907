require('dotenv').config()

const { expect } = require('chai')
const authenticateUser = require('.')
const { database, models: { User } } = require('the-keymaker-data')
const { random } = require('the-keymaker-utils')
const bcrypt = require('bcryptjs')

const { env: { DB_URL_TEST }} = process

describe('logic - authenticate user', () => {
    before(() => database.connect(DB_URL_TEST))

    let alias, email, password, path, id

    beforeEach(async () => {
        alias = `alias-${random.number(0, 100000)}`
        email = `email-${random.number(0, 100000)}@domain.com`
        password = `password-${random.number(0, 100000)}`
        path = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`

        await User.deleteMany()
        const user = await User.create({ logo: path, alias,  email, password: await bcrypt.hash(password, 10)})
        id = user.id
    })

    it('should succeed on correct data', async () => {
        const _id = await authenticateUser(email, password)
        
        expect(_id).to.exist
        expect(_id).to.be.a('string')
        expect(_id).to.equal(id)
    })

    it('should fail on missing e-mail', () => {
        email = ''

        expect(() => authenticateUser(email, password)).to.throw(Error, `e-mail is empty or blank`)
    })

    it('should fail on wrong e-mail', async () => {
        email = 'invalid@mail.com'

        try {
            await authenticateUser(email, password)

            throw new Error('should not reach this point')
        } catch({message}) {
            expect(message).to.equal(`user with e-mail ${email} does not exist`)
        }
    })

    it('should fail on wrong password', async () => {
        password = 'wrong password'

        try {
            await authenticateUser(email, password)

            throw new Error('should not reach this point')
        } catch({message}) {
            expect(message).to.equal('wrong credentials')
        }
    })

    after(() => database.disconnect())
})