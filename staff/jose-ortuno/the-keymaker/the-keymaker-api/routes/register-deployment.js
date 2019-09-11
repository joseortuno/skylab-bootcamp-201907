const logic = require('../logic')

module.exports = async function (req, res) {
    const { userId, body: { logo, alias, status, longitude, latitude } } = req

    try {
        const deployment = await logic.registerDeployment(logo, alias, status, userId, longitude, latitude)
        res.status(201).json({ message: 'deployment correctly registered', deployment })
    } catch ({ message }) {
        res.status(400).json({ error: message })
    }
}