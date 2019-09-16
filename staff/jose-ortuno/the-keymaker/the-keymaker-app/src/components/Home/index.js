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
import Results from '../Results'

export default withRouter(function ({ history }) {
    const [event, setEvent] = useState(undefined)
    const [keys, setKeys] = useState(undefined)
    const [query, setQuery] = useState(undefined)

    useEffect(() => {
        (async () => {
            const keys = await logic.retrieveKeys()

            setKeys(keys)
        })()
    }, [history.location])

    const handleEvent = (event) => {
        event.preventDefault()
        setEvent(event.target.dataset.day)
        history.push('/deployments/keys/register')
    }

    const handleQuery = (query) => {
        debugger
        setQuery(query)
        history.push('/deployments/results')
    }


    const handleLogout = () => {
        logic.logUserOut()
        history.push('/')
    }


    return <>
        <Header goOnLogout={handleLogout} onQuery={handleQuery} />
        <main>
            <Route exact path="/deployments" render={() => <Deployments />} />
            <Route path="/deployments/detail/:id" render={props => <DeploymentDetail id={props.match.params.id} />} />
            <Route path="/deployments/register" render={() => <DeploymentRegister />} />
            <Route exact path="/deployments/keys" render={() => <KeysAll />} />
            <Route path="/deployments/keys/detail/:id" render={props => <KeyDetail id={props.match.params.id} />} />
            <Route path="/deployments/keys/register" render={() => <KeyRegister onDate={event} />} />
            <Route path="/deployments/keys/calendar" render={() => keys && <KeysCalendar onKeys={keys} onEvent={handleEvent} />} />
            <Route path="/deployments/results" render={() => query && <Results onResults={query} />} />
        </main>
    </>
})