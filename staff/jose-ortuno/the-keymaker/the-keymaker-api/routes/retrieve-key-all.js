const logic = require('../logic')

module.exports = async (req, res) => {
    const { userId } = req

    try {
        const keys = await logic.retrieveKeyAll(userId)
        res.json({ message: 'key retrieved correctly', keys })
    } catch ({ message }) {
        res.status(404).json({ error: message })
    }
}