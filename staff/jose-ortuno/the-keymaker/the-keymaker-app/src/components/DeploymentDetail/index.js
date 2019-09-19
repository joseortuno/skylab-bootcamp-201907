import React, { useState, useEffect } from 'react'
import logic from '../../logic'
import { withRouter } from 'react-router-dom'
import { random } from 'the-keymaker-utils'

// COMPONENTS
import DeploymentViewDetail from '../DeploymentViewDetail'

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
        <div className='view__navigate'>
            <p>deployment detail  | </p> <button onClick={handleOnBack}> <i class="fas fa-chevron-left"></i> on back</button> | <button onClick={handleGoToRegisterDeployment}> <i class="fas fa-plus"></i> deployment</button>
        </div>
        {deployment && <DeploymentViewDetail onDeployment={deployment} />}
    </section>
})