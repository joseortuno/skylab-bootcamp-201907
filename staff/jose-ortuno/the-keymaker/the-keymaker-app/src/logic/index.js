import registerUser from './register-user'
import authenticateUser from './authenticate-user'
import isUserLogged from './is-user-logged-in'
import logUserOut from './log-user-out'
import retrieveUser from './retrieve-user'
import retrieveDeployments from './retrieve-deployments'
import registerDeployment from './register-deployment'
import registerDeploymentImage from './register-deployment-image'
import registerKey from './register-key'
import retrieveKeys from './retrieve-keys'

export default {
    set __token__(token) {
        sessionStorage.token = token
    },

    get __token__() {
        return sessionStorage.token
    },

    registerUser,
    authenticateUser,
    isUserLogged,
    logUserOut,
    retrieveUser,
    retrieveDeployments,
    registerDeployment,
    registerDeploymentImage,
    registerKey,
    retrieveKeys
    
}