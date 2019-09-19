import './index.sass'
import React, { useState, useEffect } from 'react'
import logic from '../../logic'
import { withRouter } from 'react-router-dom'
import moment from 'moment'

export default withRouter(function ({ match: { params: { id } } }) {
    const [key, setKey] = useState(undefined)
    const [validFrom, setValidFrom] = useState(undefined)
    const [validUntil, setValidUntil] = useState(undefined)
    const [deployment, setDeployment] = useState(undefined)
    const [view, setView] = useState('waiting')

    useEffect(() => {
        (async () => {
            try {
                const key = await logic.retrieveKey(id)
                setValidFrom(moment(key.valid_from).format('DD-MM-YYYY HH:mm'))
                setValidUntil(moment(key.valid_until).format('DD-MM-YYYY HH:mm'))
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
        let latitude, longitude
        navigator.geolocation.getCurrentPosition(function (position) {
            latitude = position.coords.latitude
            longitude = position.coords.longitude
            return handleUseKey(longitude, latitude)
        })
    }

    const handleUseKey = async (longitude, latitude) => {
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

    return <div className="access">
        {deployment && <>
            <header className="access__header">
                <h1>the keymaker</h1>
            </header>
            <main className="access__main">
                <div className="access__title">
                    <h2>Access to {deployment.alias}</h2>
                </div>
                <img className="access__image" src={deployment.logo} />
                <section className="access__status">
                    {view === 'waiting' && <button className="access__button" onClick={handleLocation}><i class="fas fa-chevron-right"></i>ACCESS</button>}

                    {view === 'open' && <><i className="fas fa-lock-open"></i><p>open the door</p></>}
                    {view === 'close' && <><i className="fas fa-lock"></i><p>door closed</p></>}
                    {view === 'visited' && <><i class="far fa-meh-rolling-eyes"></i><p>visited property</p></>}
                    {view === 'expiry' && <><i className="fas fa-sad-tear"></i><p>expired key</p></>}
                    {view === 'not activated' && <><i className="fas fa-clock"></i><p>key not activated</p></>}
                </section>
                <section className="access__info">
                    <h2><i class="fas fa-door-open"></i> info</h2>
                    <p>address: {deployment.address}</p>
                    <p>valid from: {validFrom}H</p>
                    <p>valid until: {validUntil}H</p>
                    <p>status: <span className={`keys__status--${key.status}`}>{key.status}</span></p>
                </section>
            </main>
        </>}
    </div>
})
