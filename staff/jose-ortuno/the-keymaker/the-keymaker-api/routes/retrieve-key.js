const logic = require('../logic')

module.exports = async (req, res) => {
    const { userId, params: { keyId } } = req

    try {
        const key = await logic.retrieveKey(userId, keyId)
        res.json({ message: 'key retrieved correctly', key })
    } catch ({ message }) {
        res.status(404).json({ error: message })
    }
}