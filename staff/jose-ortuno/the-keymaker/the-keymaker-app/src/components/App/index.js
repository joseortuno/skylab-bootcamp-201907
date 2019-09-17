import './index.sass'
import React from 'react'
import logic from '../../logic'
import { Route, withRouter } from 'react-router-dom'

// COMPONENTS
import Register from '../Register'
import Login from '../Login'
import Home from '../Home'
import AccessDeployment from '../AccessDeployment'

export default withRouter(function ({ history }) {

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
    <div className="container">
      <Route path="/access/:id" render={props => <AccessDeployment />} />

      <Route exact path="/" render={() => !logic.isUserLogged() ? <header className="landing__header" >
        <nav>
          <ul>
            <li><a href="" onClick={handleGoToRegister}>Register</a></li>
            <li><a href="" onClick={handleGoToLogin}>Login</a></li>
          </ul>
        </nav>
      </header> : history.push('/deployments')} />

      {!logic.isUserLogged() && <main className="landing__main">
        <Route path="/register" render={() => <Register onBack={handleBack} onRegister={handleRegister} />} />
        <Route path="/login" render={() => <Login onBack={handleBack} onLogin={handleLogin} />} />
      </main>}

      <Route path="/deployments" render={() => logic.isUserLogged() ? <Home onBack={handleBack} onLogout={handleLogout} /> : history.push('/')} />

      <footer>
        <p><i class="fas fa-rocket"></i> made by jose ortuño</p>
      </footer>
    </div>
  </>
})
