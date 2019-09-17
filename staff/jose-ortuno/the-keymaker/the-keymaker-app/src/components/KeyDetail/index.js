import './index.sass'
import React, { useState, useEffect } from 'react'
import logic from '../../logic'
import { withRouter } from 'react-router-dom'
import { random } from 'the-keymaker-utils'

export default withRouter(function ({ history, id }) {
    const [key, setKey] = useState(undefined)

    useEffect(() => {
        (async () => {
            try {
                const key = await logic.retrieveKey(id)
                setKey(key)
            } catch ({message}) {
                console.error(message)
            }
        })()
    }, [])

    const handleGoToRegisterKey = () => {
        history.push('/deployments/keys/register-key')
    }

    const handleOnBack = () => history.go(-1)

    return <section className='keys view'>
        <div className='filter view_navigate'>
            <p> detail key |  <button onClick={handleOnBack}> <i className="fas fa-chevron-left"></i> on back</button> | {key && <button onClick={event => {
                event.preventDefault()

                history.push(`/deployments/keys/${key.deployment}`)
            }}> <i className="fas fa-chevron-left"></i> go deployment</button>} <button onClick={handleGoToRegisterKey}> <i className="fas fa-plus"></i> key</button></p>
        </div>
        {key && <ul className='view__ul'>
                <li className='view__li' key={`${random.number(0, 99)}-${key.id}`}>guest: {key.alias_guest}</li>
                <li className='view__li' key={`${random.number(0, 99)}-${key.id}`}>valid from: {key.valid_from}</li>
                <li className='view__li' key={`${random.number(0, 99)}-${key.id}`}>valid until: {key.valid_until}</li>
                <li className={`view__li keys__status--${key.status}`} key={`${random.number(0, 99)}-${key.id}`}>status: {key.status}</li>
        </ul>}
    </section>
        })

       //  TODO: enseñar el piso con populate