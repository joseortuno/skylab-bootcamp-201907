const logic = require('../logic')

module.exports = async (req, res) => {
    const { userId, query: { q } } = req

    try {
        const key = await logic.searchKeys(userId, q)
        res.json({ message: 'key search correctly', key })
    } catch ({ message }) {
        res.status(404).json({ error: message })
    }
}