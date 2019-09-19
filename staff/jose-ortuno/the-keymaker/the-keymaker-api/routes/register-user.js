const logic = require('../logic')

module.exports = async function (req, res) {
    const { body: { alias, email, password, repassword } } = req

    try {
        await logic.registerUser(alias, email, password, repassword)
        res.status(201).json({ message: 'user correctly registered' })
    } catch ({ message }) {
        res.status(400).json({ error: message })
    }
}