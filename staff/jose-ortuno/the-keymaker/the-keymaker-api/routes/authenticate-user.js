const logic = require('../logic')
const jwt = require('jsonwebtoken')

const { env: { JWT_SECRET } } = process

module.exports = async (req, res) => {
    const { body: { email, password } } = req

    try {
        const userId = await logic.authenticateUser(email, password)
        const token = jwt.sign({ sub: userId }, JWT_SECRET)
        res.json({ message: 'user correctly authenticated', userId, token })
    } catch ({ message }) {
        res.status(401).json({ error: message })
    }
}