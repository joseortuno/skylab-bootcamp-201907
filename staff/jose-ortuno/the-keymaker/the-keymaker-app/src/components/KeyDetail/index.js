import React, { useState, useEffect } from 'react'
import logic from '../../logic'
import { withRouter } from 'react-router-dom'


// COMPONENTS
import KeyView from '../KeyView'

export default withRouter(function ({ history, id }) {
    const [key, setKey] = useState(undefined)

    useEffect(() => {
        (async () => {
            try {
                const key = await logic.retrieveKey(id)
                setKey(key)
            } catch ({ message }) {
                console.error(message)
            }
        })()
    }, [])

    const handleGoToRegisterKey = () => {
        history.push('/deployments/keys/register')
    }

    const handleOnBack = () => history.go(-1)

    return <section className='key view'>
        <section className='view__navigate'>
            <p> detail key |  <button onClick={handleOnBack}> <i className="fas fa-chevron-left"></i> on back</button> | {key && <button onClick={event => {
                event.preventDefault()

                history.push(`/deployments/detail/${key.deployment}`)
            }}> <i className="fas fa-chevron-left"></i> go deployment</button>} <button onClick={handleGoToRegisterKey}> <i className="fas fa-plus"></i> key</button></p>
        </section>
        {key && <section className="key__detail"> <KeyView onKey={key} />
        </section>}
    </section>
})