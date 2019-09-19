const logic = require('../logic')

module.exports = async function (req, res) {
    const { userId, body } = req

    try {
        await logic.updateUser(userId, body)
        res.json({ message: 'user correctly updated' })
    } catch ({ message }) {
        res.status(404).json({ error: message })
    }
}