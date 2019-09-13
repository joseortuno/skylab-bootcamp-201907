import './index.sass'
import React from 'react'
import { Route, withRouter } from 'react-router-dom'

// COMPONENTS
import RegisterKey from '../RegisterKey'
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
            <Route exact path="/deployments/keys" render={() => <ViewKeys />} />
            <Route path="/deployments/keys/register-key" render={() => <RegisterKey />} />
        </main>

    </>
})