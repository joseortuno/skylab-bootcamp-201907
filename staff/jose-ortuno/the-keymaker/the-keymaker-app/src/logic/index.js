import registerUser from './register-user'
import authenticateUser from './authenticate-user'
import isUserLogged from './is-user-logged-in'
import logUserOut from './log-user-out'
import retrieveUser from './retrieve-user'
import retrieveDeployments from './retrieve-deployments'
import retrieveDeployment from './retrieve-deployment'
import registerDeployment from './register-deployment'
import registerDeploymentImage from './register-deployment-image'
import registerKey from './register-key'
import retrieveKeys from './retrieve-keys'
import retrieveKey from './retrieve-key'
import useKey from './use-key'
import searchKeys from './search-keys'
import searchDeployments from './search-deployments'
import getLocation from './get-location'

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
    retrieveDeployment,
    registerDeployment,
    registerDeploymentImage,
    registerKey,
    retrieveKeys,
    retrieveKey,
    useKey,
    searchKeys,
    searchDeployments,
    getLocation
}