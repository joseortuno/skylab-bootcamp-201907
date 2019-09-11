require('dotenv').config()

const { expect } = require('chai')
const registerUser = require('.')
const { database, models: { User } } = require('the-keymaker-data')
const bcrypt = require('bcryptjs')

const { env: { DB_URL_TEST } } = process

describe('logic - register user', () => {
    before(() => database.connect(DB_URL_TEST))

    let alias, email, password
    let alias1, email1, password1
    let alias2, email2, password2

    beforeEach(async () => {
        alias = `alias-${Math.random()}`
        email = `email-${Math.random()}@domain.com`
        password = `password-${Math.random()}`

        alias1 = `alias-${Math.random()}`
        email1 = `email-${Math.random()}@domain.com`
        password1 = `password-${Math.random()}`

        alias2 = `alias-${Math.random()}`
        email2 = `email-${Math.random()}@domain.com`
        password2 = `password-${Math.random()}`

        return await User.deleteMany()
    })

    it('should succeed on correct data', async () => {
        const result = await registerUser(alias1, email1, password1, password1)
        expect(result).not.to.exist

        const user = await User.findOne({ email: email1 })
        expect(user).to.exist
        expect(user.alias).to.equal(alias1)
        expect(user.email).to.equal(email1)
        const match = await bcrypt.compare(password1, user.password)
        expect(match).to.be.true
    })

    it('should fail if the alias already exists', async () => {

        await User.create({ logo: '/img/user', alias: alias1, email: email2, password: password1 })

        try {
            await registerUser(alias1, email1, password1, password1)
        } catch (error) {
            expect(error).to.exist
            expect(error.message).to.equal(`Alias already exists`)
        }
    })

    it('should fail if the email already exists', async () => {

        await User.create({ logo: '/img/user', alias: alias2, email: email1, password: password2 })

        try {
            await registerUser(alias1, email2, password1, password1)
        } catch (error) {
            expect(error).to.exist
            expect(error.message).to.equal(`Alias already exists`)
        }
    })

    // Alias
    it('should fail on empty alias', () => 
        expect(() => registerUser('', email, password, password)).to.throw(Error, 'alias is empty or blank'))

    it('should fail on undefined name', () => 
        expect(() => registerUser(undefined, email, password, password)).to.throw(Error, 'alias with value undefined is not a string')
    )
    it('should fail on wrong data type for alias', () => 
        expect(() => registerUser(123, email, password, password)).to.throw(Error, 'alias with value 123 is not a string')
    )

    // Email
    it('should fail on empty email', () => 
    expect(() => registerUser(alias, '', password, password)).to.throw(Error, 'email is empty or blank'))

    it('should fail on undefined surname', () => 
        expect(() => registerUser(alias, undefined, password, password)).to.throw(Error, 'email with value undefined is not a string'))

    it('should fail on wrong data type for email', () => 
        expect(() => registerUser(alias, 123, password, password)).to.throw(Error, 'email with value 123 is not a string'))

    it('should fail on wrong email format', () => 
        expect(() => registerUser(alias, 'a@a', password, password)).to.throw(Error, 'email with value a@a is not a valid e-mail'))

    // Password
    it('should fail on empty password', () => 
        expect(() => registerUser(alias, email, '', password)).to.throw(Error, 'password is empty or blank'))

    it('should fail on undefined password', () => 
        expect(() => registerUser(alias, email, undefined, password)
    ).to.throw(Error, `password with value undefined is not a string`))

    it('should fail on wrong data type for password', () => 
        expect(() => registerUser(alias, email, 123, password)).to.throw(Error, `password with value 123 is not a string`))
    
    it('should fail on wrong repeat password', () => 
        expect(() => registerUser(alias, email, password, password1)).to.throw(Error, `passwords do not match`))

    after(() => database.disconnect())
})