import './index.sass'
import React, { useState, useEffect } from 'react'
import { Route, withRouter } from 'react-router-dom'
import logic from '../../logic'

// COMPONENTS
import Deployments from '../Deployments'
import DeploymentDetail from '../DeploymentDetail'
import DeploymentRegister from '../DeploymentRegister'
import KeysAll from '../KeysAll'
import KeyDetail from '../KeyDetail'
import KeyRegister from '../KeyRegister'
import KeysCalendar from '../KeysCalendar'
import Header from '../Header'

export default withRouter(function ({ history }) {
    const [event, setEvent] = useState(undefined)
    const [keys, setKeys] = useState(undefined)

    useEffect(() => {
        (async () => {
            try {
                const keys = await logic.retrieveKeys()
                setKeys(keys)
            } catch ({message}) {
                console.error(message)
            }
        })()
    }, [history.location])

    const handleEvent = (event) => {
        event.preventDefault()
        setEvent(event.target.dataset.day)
        history.push('/deployments/keys/register')
    }

    const handleLogout = () => {
        logic.logUserOut()
        history.push('/')
    }


    return <>
        <Header goOnLogout={handleLogout} />
        <main>
            <Route exact path="/deployments" render={() => <Deployments />} />
            <Route path="/deployments/detail/:id" render={props => <DeploymentDetail id={props.match.params.id} />} />
            <Route path="/deployments/register" render={() => <DeploymentRegister />} />
            <Route exact path="/deployments/keys" render={() => <KeysAll />} />
            <Route path="/deployments/keys/detail/:id" render={props => <KeyDetail id={props.match.params.id} />} />
            <Route path="/deployments/keys/register" render={() => <KeyRegister onDate={event} />} />
            <Route path="/deployments/keys/calendar" render={() => keys && <KeysCalendar onEvent={handleEvent} />} />
        </main>
    </>
})