const { Router } = require('express')
const bodyParser = require('body-parser')
const tokenMiddleware = require('../helpers/token-middleware')
const router = Router()
const jsonBodyParser = bodyParser.json()

/**********************************************************************
 * CONNECT TO LOGIC
 *********************************************************************/

// USER
const registerUser = require('./register-user')
const authenticateUser = require('./authenticate-user')
const retrieveUser = require('./retrieve-user')
const updateUser = require('./update-user')

// DEPLOYMENT
const registerDeployment = require('./register-deployment')
const retrieveDeployment = require('./retrieve-deployment')
const retrieveDeploymentAll = require('./retrieve-deployment-all')
const updateDeployment = require('./update-deployment')
const searchDeployments = require('./search-deployments')

// KEY
const registerKey = require('./register-key')
const retrieveKey = require('./retrieve-key')
const retrieveKeyAll = require('./retrieve-key-all')
const updateKey = require('./update-key')
const useKey = require('./use-key')

// IMAGE
const uploadImageDeployment = require('./upload-image-deployment')
const uploadImageUser = require('./upload-image-user')

/**********************************************************************
 * ENDPOINTS
 *********************************************************************/

// USER
router.post('/users', jsonBodyParser, registerUser)
router.post('/auth', jsonBodyParser, authenticateUser)
router.get('/users', [tokenMiddleware, jsonBodyParser], retrieveUser)
router.patch('/users', [tokenMiddleware, jsonBodyParser], updateUser)

// DEPLOYMENT
router.post('/deployment', [tokenMiddleware, jsonBodyParser], registerDeployment)
router.get('/deployment/:deploymentId/', [tokenMiddleware, jsonBodyParser], retrieveDeployment)
router.get('/deployments', [tokenMiddleware, jsonBodyParser], retrieveDeploymentAll)
router.patch('/deployment/:deploymentId/', [tokenMiddleware, jsonBodyParser], updateDeployment)
router.get('/deployments/search/:query', [tokenMiddleware, jsonBodyParser], searchDeployments)

// KEY
router.post('/key', [tokenMiddleware, jsonBodyParser], registerKey)
router.get('/key/:keyId/', [tokenMiddleware, jsonBodyParser], retrieveKey)
router.get('/keys', [tokenMiddleware, jsonBodyParser], retrieveKeyAll)
router.get('/key/:keyId/longitude/:longitude/latitude/:latitude/', jsonBodyParser, useKey)
router.get('/key/:keyId/', [tokenMiddleware, jsonBodyParser], updateKey)
router.get('/keys/search/:query', [tokenMiddleware, jsonBodyParser], searchKey)

// IMAGE
router.post('/users/deployment/:deploymentId/upload/', tokenMiddleware, uploadImageDeployment)
router.post('/users/upload/', tokenMiddleware, uploadImageUser)

module.exports = router