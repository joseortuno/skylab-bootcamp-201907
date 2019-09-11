module.exports = {
    registerUser: require('./register-user'),
    authenticateUser: require('./authenticate-user'),
    retrieveUser: require('./retrieve-user'),
    updateUser: require('./update-user'),
    registerDeployment: require('./register-deployment'),
    registerKey: require('./register-key'),
    useKey: require('./use-key'),
    retrieveDeployment: require('./retrieve-deployment'),
    retrieveDeploymentAll: require('./retrieve-deployment-all'),
    retrieveKey: require('./retrieve-key'),
    retrieveKeyAll: require('./retrieve-key-all'),
    searchKeys: require('./search-keys'),
    searchDeployments: require('./search-deployments'),
    updateDeployment: require('./update-deployment'),
    updateKey: require('./update-key'),
    uploadImageDeployment: require('./upload-image-deployment'),
    uploadImageUser: require('./upload-image-user')
}