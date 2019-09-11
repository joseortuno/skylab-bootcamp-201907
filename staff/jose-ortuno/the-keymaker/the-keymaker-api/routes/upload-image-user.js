const logic = require('../logic')
const Busboy = require('busboy')

module.exports = (req, res) => {
    const { userId } = req
    const busboy = new Busboy({ headers: req.headers })
    debugger
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        logic.uploadImageUser(userId, file)
            .then(() => res.json({ message: 'user image successfully uploaded' }))
            .catch(({message}) => res.status(400).json({ error: message }))

    })
    req.pipe(busboy)
}