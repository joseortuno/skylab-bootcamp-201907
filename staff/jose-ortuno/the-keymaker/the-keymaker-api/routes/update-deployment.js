const logic = require('../logic')

module.exports = async function (req, res) {
    const { userId, params: { deploymentId }, body } = req

    try {
        await logic.updateDeployment(userId, deploymentId, body)
        res.json({ message: 'deployment correctly updated' })
    } catch ({ message }) {
        res.status(404).json({ error: message })
    }
}