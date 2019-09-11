import authenticateUser from './authenticate-user'
import retrieveUser from './retrieve-user'
import isUserLogged from './is-user-logged'

export default {
    set userCredentials({token}){
        sessionStorage.token = token
    },
    get userCredentials(){
        return { token: sessionStorage.token }
    },
    authenticateUser,
    retrieveUser,
    isUserLogged
}
      
      