import registerUser from '.'

const { random } = Math
const { database, models: { User } } = require('the-keymaker-data')
const bcrypt = require('bcryptjs')

// const { env: { DB_URL_TEST }} = process // WARN this destructuring doesn't work in react-app :(
const REACT_APP_DB_URL_TEST = process.env.REACT_APP_DB_URL_TEST

describe('logic - register user', () => {
    let alias, email, password

    beforeAll(() => database.connect(REACT_APP_DB_URL_TEST))

    beforeEach(async () => {
        alias = `name-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`

        await User.deleteMany()
    })

    it('should succeed on correct data', async () => {
        debugger
        const response = await registerUser(alias, email, password, password)

        expect(response).toBeUndefined()
        debugger
        const user = await User.findOne({ email })
        
        expect(user).toBeDefined()
        expect(user.alias).toBe(alias)
        expect(user.email).toBe(email)
        // expect(user.password).toBe(password)

        const match = await bcrypt.compare(password, user.password)
        expect(match).toBeTruthy()
    })

    afterAll(() => database.disconnect())
})