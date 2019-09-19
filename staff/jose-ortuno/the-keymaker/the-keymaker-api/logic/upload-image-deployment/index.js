require('dotenv').config()
const { validate } = require('the-keymaker-utils')
const { models: { Deployment } } = require('the-keymaker-data')
const cloudinary = require('cloudinary')
const { env: { CLOUDINARY_API_KEY, CLOUDINARY_NAME, CLOUDINARY_SECRET_KEY } } = process
/**
* Upload image deployment
* 
* @param {String} deploymentId 
* @param {Stream} image
* 
* @throws {TypeError} - if userId is not a string or buffer is not a buffer.
* @throws {Error} - if any param is empty, user is not found or image could not be uploaded.
*
* @returns {Object} - user.  
*/
module.exports = function (userId, deploymentId, image) {
    validate.string(userId, 'user id')
    validate.string(deploymentId, 'deployment id')
    // validate.object(image, 'stream');
    return (async () => {
        // TODO: check user existence and user vs ad
        const deployment = await Deployment.findById(deploymentId)
        if (!deployment) throw new Error(`user with userId ${deploymentId} not found`)

        cloudinary.config({
            cloud_name: CLOUDINARY_NAME,
            api_key: CLOUDINARY_API_KEY,
            api_secret: CLOUDINARY_SECRET_KEY
        })

        const _image = await new Promise((resolve, reject) => {
            const upload_stream = cloudinary.v2.uploader.upload_stream((err, image) => {
                if (err) return reject(err)
                resolve(image)
            })
            image.pipe(upload_stream)
        })
        await Deployment.updateOne({ _id: deploymentId },{ $set: {logo:_image.secure_url } })
    })()
}