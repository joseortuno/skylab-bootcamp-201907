const logic = require('../logic')

module.exports = async function (req, res) {
    const { userId, body: { validFrom, validUntil, aliasGuest, emailGuest, deploymentId } } = req

    try {
        const key = await logic.registerKey(validFrom, validUntil, aliasGuest, emailGuest, deploymentId, userId)
        res.status(201).json({ message: 'key correctly registered', key })
    } catch ({ message }) {
        res.status(400).json({ error: message })
    }
}