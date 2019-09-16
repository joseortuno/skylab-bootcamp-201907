const logic = require('../logic')

module.exports = async (req, res) => {
    const { params: { keyId } } = req

    try {
        const key = await logic.retrieveKey(keyId)
        res.json({ message: 'key retrieved correctly', key })
    } catch ({ message }) {
        res.status(404).json({ error: message })
    }
}