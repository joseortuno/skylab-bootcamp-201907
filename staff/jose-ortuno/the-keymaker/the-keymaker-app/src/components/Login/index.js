/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react'
import Context from '../Context'
import logic from '../../logic'
import { withRouter } from 'react-router-dom'



function Login({ history }) {
    
    const { setCredentials } = useContext(Context)
    
    function handleSubmit(event) {
        event.preventDefault()
        const { target: { email: { value: email }, password: { value: password } } } = event
        handleLogin(email, password)
    }

    async function handleLogin(email, password) {
        try {
            const { id, token } = await logic.authenticateUser(email, password)
            
            logic.userCredentials = { id, token }
            history.push('/home')
        } catch(error) {
            console.log(error.message)
        }
    }

    return <>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" />
            <input type="password" name="password" />
            <button>Submit</button>
        </form>
    </>
}

export default withRouter(Login)