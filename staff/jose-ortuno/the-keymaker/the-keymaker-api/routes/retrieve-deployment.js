const logic = require('../logic')

module.exports = async (req, res) => {
    const { params: { deploymentId } } = req

    try {
        const deployment = await logic.retrieveDeployment(deploymentId)
        res.json({ message: 'deployment retrieved correctly', deployment })
    } catch ({ message }) {
        res.status(404).json({ error: message })
    }
}