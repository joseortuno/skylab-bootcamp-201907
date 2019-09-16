import './index.sass'
import React, { useState, useEffect } from 'react'
import logic from '../../logic'
import { withRouter } from 'react-router-dom'
import { random } from 'the-keymaker-utils'

export default withRouter(function ({ history, id }) {
    const [deployment, setDeployment] = useState(undefined)
    
    useEffect(() => {
        (async () => {
            const deployment = await logic.retrieveDeployment(id)
            setDeployment(deployment)
        })()
    }, [])
    
    const handleGoToRegisterDeployment = () => {
        history.push('/deployments/register')
    }

    const handleOnBack = () => history.go(-1)

    return <section className='deployments view'>
        <div className='filter view_navigate'>
            <p>deployment detail | <button onClick={handleOnBack}> <i class="fas fa-chevron-left"></i> on back</button> | <button onClick={handleGoToRegisterDeployment}> <i class="fas fa-plus"></i> deployment</button></p>
        </div>
        {deployment && <ul className='view__ul'>
        <li className='view__li' key={`${random.number(0, 99)}-${deployment.id}`}>deployment: <img src={deployment.logo} /></li>
        <li className='view__li' key={`${random.number(0, 99)}-${deployment.id}`}>deployment: {deployment.alias}</li>
        <li className='view__li' key={`${random.number(0, 99)}-${deployment.id}`}>location: longitude:{deployment.location.longitude}, latitude: {deployment.location.longitude}</li>
        <li className={`view__li deployments__status--${deployment.status}`} key={`${random.number(0, 99)}-${deployment.id}`}>status: {deployment.status === true && 'active' || 'inactive'}</li>
    </ul>}
    </section>
})