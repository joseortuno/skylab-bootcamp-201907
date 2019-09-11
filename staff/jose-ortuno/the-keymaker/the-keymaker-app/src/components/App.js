/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import Context from './Context'
import Landing from './Landing'
import Home from './Home'

import { withRouter, Route } from 'react-router-dom'
import logic from '../logic'
const { token } = sessionStorage

function App({ history }) {
  const [view, setView] = useState('')
  const [credentials, setCredentials] = useState({ token })
  const [user, setUser] = useState(undefined)
  
  const[products,setProducts] = useState(undefined)

  return (
      <div className="App">
        <Context.Provider value={{ view, setView, credentials, setCredentials, user, setUser, products,setProducts }} >

          <Route exact path="/" render={() => logic.isUserLogged() ? history.push('/home') : <Landing /> } />

          <Route path="/home" render={() => logic.isUserLogged() ? <Home /> :  history.push('/')  } />
          
        </Context.Provider>
        </div>
    )
}
export default withRouter(App)