const logic = require('../logic')

module.exports = async (req, res) => {
    const { userId } = req

    try {
        const deployments = await logic.retrieveDeploymentAll(userId)
        res.json({ message: 'deployment retrieved correctly', deployments })
    } catch ({ message }) {
        res.status(404).json({ error: message })
    }
}