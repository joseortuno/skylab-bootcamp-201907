const logic = require('../logic')

module.exports = async function (req, res) {
    const { userId, params: { keyId }, body } = req

    try {
        await logic.updateKey(userId, keyId, body)
        res.json({ message: 'key correctly updated' })
    } catch ({ message }) {
        res.status(404).json({ error: message })
    }
}