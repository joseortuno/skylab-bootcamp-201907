const logic = require('../logic')
const Busboy = require('busboy')

module.exports = (req, res) => {
    const { userId, params: { deploymentId } } = req
    const busboy = new Busboy({ headers: req.headers })

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        logic.uploadImageDeployment(userId, deploymentId, file)
            .then(() => res.status(200).json({ message: 'deployment image successfully uploaded' }))
            .catch(({ message }) => res.status(400).json({ error: message }))
    })
    req.pipe(busboy)

}