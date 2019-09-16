const logic = require('../logic')

module.exports = async (req, res) => {
    const { userId, params: { query } } = req
debugger
    try {
        const deployment = await logic.searchDeployments(userId, query)
        res.json({ message: 'deployment search correctly', deployment })
    } catch ({ message }) {
        res.status(404).json({ error: message })
    }
}