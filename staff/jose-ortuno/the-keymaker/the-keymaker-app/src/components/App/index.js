import './index.sass'
import React, { useState, useEffect } from 'react'
import Register from '../Register'
import Login from '../Login'
import logic from '../../logic'
import { Route, Switch, withRouter } from 'react-router-dom'

import Home from '../Home'

export default withRouter(function ({ history }) {
  const [view, setView] = useState(logic.isUserLogged() ? 'home' : undefined)

  const handleBack = () => {
    setView(undefined)

    history.push('/')
  }

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

    setView('register')

    history.push('/register')
  }

  const handleGoToLogin = event => {
    event.preventDefault()

    setView('login')

    history.push('/login')
  }

  useEffect(() => {
    if (history.location.pathname === '/') setView(undefined)
  }, [history.location])

  const handleLogout = () => {
    logic.logUserOut()

    setView(undefined)
    history.push('/')
  }

  return <div>
    <header>
      {view !== 'home' && <nav>
        <ul>
          {view !== 'register' && <li><a href="" onClick={handleGoToRegister}>Register</a></li>}
          {view !== 'login' && <li><a href="" onClick={handleGoToLogin}>Login</a></li>}
        </ul>
      </nav>}
    </header>

      <Route path="/register" render={() => <Register onBack={handleBack} onRegister={handleRegister} />} />
      <Route path="/login" render={() => <Login onBack={handleBack} onLogin={handleLogin} />} />
      <Route path="/deployments" render={() => logic.isUserLogged() ? <Home onBack={handleBack} onLogout={handleLogout} /> : history.push('/')} />

  </div>
})
