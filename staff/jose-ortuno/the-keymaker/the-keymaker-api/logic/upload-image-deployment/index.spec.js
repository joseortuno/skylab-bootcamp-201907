require('dotenv').config()
const { expect } = require('chai')
const uploadImageDeployment = require('.')
const { database, models: { User, Deployment } } = require('the-keymaker-data')
const { random } = require('the-keymaker-utils')
const fs = require('fs')
const { env: { DB_URL_TEST } } = process


describe('logic - upload image deployment', () => {
    before(() => database.connect(DB_URL_TEST))
    // user
    let alias_user, email, password, userId, path

    // deployment
    let alias_deployment, status, deploymentId

    // deployment Skylab
    const longitude = 2.199905
    const latitude = 41.398406

    beforeEach(async () => {
        // user
        alias_user = `alias_user-${random.number(0, 100000)}`
        email = `email-${random.number(0, 100000)}@domain.com`
        password = `password-${random.number(0, 100000)}`
        path = `path/${random.number(0, 100000)}/${random.number(0, 100000)}/${random.number(0, 100000)}`

        await User.deleteMany()
        const user = await User.create({ logo: path, alias: alias_user, email, password })
        userId = user.id

        // deployment
        alias_deployment = `alias_deployment-${random.number(0, 100000)}`
        email_deployment = `email-${random.number(0, 100000)}@domain.com`
        status = random.boolean()

        await Deployment.deleteMany()
        const deployment = await Deployment.create({ alias: alias_deployment, status, user: userId, location: { coordinates: [longitude, latitude] } })
        deploymentId = deployment.id
        
        image = fs.createReadStream('./test/smiley.png')
    })
    
    it('should succeed on correct image', async () => {
        const result = await uploadImageDeployment(userId, deploymentId, image)
        expect(result).not.to.exist
        
        const deployment = await Deployment.findById(deploymentId)
        expect(deployment.logo).to.exist
        expect(deployment.alias).to.equal(alias_deployment)
        expect(deployment.status).to.equal(status)
        expect(deployment.user._id.toString()).to.equal(userId)
        expect(deployment.id).to.exist
        expect(deployment.location).to.exist
    })
    
    after(() => database.disconnect())
})