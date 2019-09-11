const logic = require('../logic')

module.exports = async function (req, res) {
    const { params: { keyId, longitude, latitude } } = req
debugger
    try {
        const deployment = await logic.useKey(keyId, longitude, latitude)
        res.json({ message: 'key requested correctly', deployment })
    } catch ({ message }) {
        res.status(404).json({ error: message })
    }
}