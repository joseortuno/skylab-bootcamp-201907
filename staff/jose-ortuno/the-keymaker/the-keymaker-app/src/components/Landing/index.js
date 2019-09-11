/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect } from 'react'
import Context from '../Context'
import logic from '../../logic'
import { withRouter, Route } from 'react-router-dom'
import Login from '../Login'

export default function Landing() {

    const { credentials, setView, user, setUser } = useContext(Context)

    useEffect(() => {

        if (credentials) {
          const { id, token } = credentials

          async function retrieve() {
            try {
              const { user: userRetrieved } = await logic.retrieveUser(id, token)
              setUser(userRetrieved)
            } catch(error) {
              console.log(error.message)
            }
          }                                      
          retrieve()
        }
    }, [credentials])

    return  <>
  
        <section>
          <h1>LOGIN</h1>
          <Login />
        </section>
        
      </>
}