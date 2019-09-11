const logic = require('../logic')

module.exports = async (req, res) => {
    const { userId, query: { q } } = req

    try {
        const deployment = await logic.searchDeployments(userId, q)
        res.json({ message: 'key search correctly', deployment })
    } catch ({ message }) {
        res.status(404).json({ error: message })
    }
}