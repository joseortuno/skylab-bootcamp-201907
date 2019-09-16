const { models: { User } } = require('the-keymaker-data')
const { validate } = require('the-keymaker-utils')
const bcrypt = require('bcryptjs')

module.exports =
    /**
     * Register user
     * 
     * @param {string} alias
     * @param {string} email 
     * @param {string} password 
     * @param {string} repassword 
     * 
     * @return {Promise}
     * @return {string} id user
     */
    function (alias, email, password, repassword) {
        validate.string(alias, 'alias')
        validate.string(email, 'email')
        validate.email(email, 'email')
        validate.string(password, 'password')
        validate.string(repassword, 'repassword')

        if (password !== repassword) throw new Error('passwords do not match')

        return (async () => {
            const checkAlias = await User.findOne({ alias })
            if (checkAlias) throw Error('Alias already exists')
            const checkEmail = await User.findOne({ email })
            if (checkEmail) throw Error('Email already exists')
            
            const hash = await bcrypt.hash(password,10)

            await User.create({ logo: 'https://res.cloudinary.com/dgsndtxtl/image/upload/v1568565584/gettyimages-758378481_emty9v.jpg', alias, email, password: hash })
        })()
    }