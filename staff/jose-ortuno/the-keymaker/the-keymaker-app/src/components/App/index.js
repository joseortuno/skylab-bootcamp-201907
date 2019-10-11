import './index.sass'
import React, { useState } from 'react'
import logic from '../../logic'
import { Route, withRouter } from 'react-router-dom'

// COMPONENTS
import Register from '../Register'
import Login from '../Login'
import Home from '../Home'
import AccessDeployment from '../AccessDeployment'
import Landing from '../Landing'
import LandingList from '../LandingList'

export default withRouter(function ({ history }) {
  const [view, setView] = useState('landing')

  const handleBack = () => history.push('/')

  const handleRegister = async (alias, email, password, repassword) => {
    try {
      await logic.registerUser(alias, email, password, repassword)

      history.push('/login')
    } catch ({ message }) {
      console.log('fail register', message)
    }
  }

  const handleLogin = async (email, password) => {
    try {
      await logic.authenticateUser(email, password)
      setView('home')
      history.push('/deployments')
    } catch ({ message }) {
      console.log('fail login', message)
    }
  }

  const handleGoToRegister = event => {
    event.preventDefault()
    history.push('/register')
  }

  const handleGoToLogin = event => {
    event.preventDefault()
    history.push('/login')
  }


  const handleLogout = () => {
    logic.logUserOut()
    history.push('/')
  }

  return <>
    <Route path="/access/:id" render={props => <AccessDeployment />} />
    <div className="container">

      <section className="landing">
        <Route exact path="/" render={() => !logic.isUserLogged() ? <>
          <Landing />
          <LandingList onRegister={handleGoToRegister} onLogin={handleGoToLogin} />
        </> : history.push('/deployments')} />

        <Route path="/register" render={() => <>
          <Landing />
          <Register onBack={handleBack} onRegister={handleRegister} />
        </>} />

        <Route path="/login" render={() => <>
          <Landing />
          <Login onBack={handleBack} onLogin={handleLogin} />
        </>} />
      </section>

      <Route path="/deployments" render={() => logic.isUserLogged() ? <Home onBack={handleBack} onLogout={handleLogout} /> : history.push('/')} />
    </div>
  </>
})
