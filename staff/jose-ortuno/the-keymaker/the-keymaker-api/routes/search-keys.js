const logic = require('../logic')

module.exports = async (req, res) => {
    const { userId, params: { query } } = req
    
    try {
        const key = await logic.searchKeys(userId, query)
        res.json({ message: 'key search correctly', key })
    } catch ({ message }) {
        res.status(404).json({ error: message })
    }
}