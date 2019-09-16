import './index.sass'
import React, { useState, useEffect } from 'react'
import logic from '../../logic'
import { withRouter } from 'react-router-dom'

export default withRouter(function ({ match: { params: { id } } }) {
    const [key, setKey] = useState(undefined)
    const [deployment, setDeployment] = useState(undefined)
    const [response, setResponse] = useState(undefined)
    const [view, setView] = useState('waiting')

    useEffect(() => {
        (async () => {
            try {
                const key = await logic.retrieveKey(id)
                setKey(key)

                const deployment = await logic.retrieveDeployment(key.deployment)
                setDeployment(deployment)
            } catch ({ message }) {
                console.error(message)
            }
        })()
    }, [])

    const handleLocation = (event) => {
        event.preventDefault()
        debugger
        let latitude, longitude
        navigator.geolocation.getCurrentPosition(function (position) {
            latitude = position.coords.latitude
            longitude = position.coords.longitude
            return handleUseKey(longitude, latitude)
        })
    }

    const handleUseKey = async (longitude, latitude) => {
        debugger
        try {
            const { deployment } = await logic.useKey(id, longitude, latitude)
            if (deployment.status === 'close') setView('close')
            if (deployment.status === 'open') setView('open')
            console.log(deployment.status)
        } catch ({ message }) {
            if (message === 'jwt expired') setView('expiry')
            if (message === 'jwt not active') setView('not activated')
            if (message === `operation not allowed: the state of the key is ${key.status}`) setView('visited')
            console.error(message)
        }
    }

    return <>
        {deployment && <>
            <header className="access_header">
                <h1>the keymaker</h1>
            </header>
            <main className="access">
                <h2>Access to {deployment.alias}</h2>
                <img className="access__img" src={deployment.logo} />
                <p>info</p>
                <section>
                    {view === 'waiting' && <button onClick={handleLocation}>ACCESS</button>}
                    {view === 'open' && <i className="fas fa-lock-open"></i>}
                    {view === 'close' && <i className="fas fa-lock"></i>}
                    {view === 'visited' && <i class="far fa-meh-rolling-eyes"></i>}
                    {view === 'expiry' && <i className="fas fa-sad-tear"></i>}
                    {view === 'not activated' && <i className="fas fa-clock"></i>}
                </section>
            </main>
        </>}
    </>
})
