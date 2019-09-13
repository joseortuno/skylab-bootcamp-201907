import './index.sass'
import React, { useState, useEffect } from 'react'
import logic from '../../logic'
import { withRouter } from 'react-router-dom'

export default withRouter(function ({ history }) {
    const [deployments, setDeployments] = useState(undefined)

    const handleGoToRegisterDeployment = () => {
        history.push('/deployments/register-deployment')
    }

    useEffect(() => {
        (async () => {
            const deployments = await logic.retrieveDeployments()

            setDeployments(deployments)
        })()
    }, [])

    return <section className='deployments view'>
        <div className='filter view_navigate'>
            <p>filter deployments: <button>active</button> <button>inactive</button> <button>all</button> | <button onClick={handleGoToRegisterDeployment}>+ deployment</button></p>
        </div>
        {deployments && <div className='view_list'>
            <div className="view__column" key={Math.random()}>
                <div className='view__title' key={Math.random()}>deployment</div>
                <div className='view__title' key={Math.random()}>image</div>
            </div>
            {deployments.map(deployment => {
                return <div key={Math.random()}>
                    <div className='view_item' key={Math.random()}>{deployment.alias}</div>
                    <div className='view_item' key={Math.random()}>{deployment.logo === '/img/user' && 'no' || 'yes'}</div>
                    <div className='view_item' key={deployment.id}><button >+ edit</button></div>
                    <div className='view_item' key={Math.random()}><button>+ key generator</button></div>
                </div>
            })}
        </div>}
    </section>
})