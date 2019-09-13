import React from 'react'
import './index.sass'
import { Route, withRouter } from 'react-router-dom'

// COMPONENTS
import ViewKeys from '../ViewKeys'
import RegisterDeployment from '../RegisterDeployment'
import ViewDeployments from '../ViewDeployments'
import Header from '../Header'

export default withRouter(function ({ onLogout }) {

    return <>
        <Header goOnLogout={onLogout} />
        <main>
            <Route exact path="/deployments" render={() => <ViewDeployments />} />
            <Route path="/deployments/register-deployment" render={() => <RegisterDeployment />} />
            <Route path="/keys" render={() => <ViewKeys />} />
            <Route path="/keys/register-key" render={() => <RegisterKey />} />
        </main>

    </>
})