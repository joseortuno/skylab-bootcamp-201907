import './index.sass'
import React, { useState, useEffect } from 'react'
import logic from '../../logic'
import { withRouter, Link } from 'react-router-dom'
import moment from 'moment'

export default withRouter(function ({ history }) {
    const [deployments, setDeployments] = useState(undefined)
    
    useEffect(() => {
        (async () => {
            const deployments = await logic.retrieveDeployments()
            deployments.length === 0 && {} || setDeployments(deployments)
            const deploymentsArr = deployments.sort(function (a, b) {
                return (b.created_at - a.created_at)
            })
            setDeployments(deploymentsArr)
        })()
    }, [])

    const handleGoToRegisterDeployment = () => {
        history.push('/deployments/register')
    }

    return <section className='deployments view'>
        <div className='filter view__navigate'>
            <p>filter deployments: <button>active</button> <button>inactive</button> <button>all</button> | <button onClick={handleGoToRegisterDeployment}><i class="fas fa-plus"></i> deployment</button></p>
        </div>
        {deployments && <div className='view__list'>
            <div className="view__var" key={Math.random()}>
                <div className='view__title' key={Math.random()}>deployment</div>
                <div className='view__title' key={Math.random()}>image</div>
                <div className='view__title' key={Math.random()}>created at</div>
            </div>
            {deployments.map(deployment => {
                return <Link key={Math.random()} to={`/deployments/detail/${deployment.id}`}>
                    <div className='view__item' key={Math.random()}>{deployment.alias}</div>
                    <div className='view__item' key={Math.random()}>{deployment.logo === '/img/user' && 'no' || 'yes'}</div>
                    <div className='view__item' key={Math.random()}>{deployment.created_at}</div>
                    <div className='view__item' key={deployment.id}><button ><i class="fas fa-plus"></i> edit</button></div>
                    <div className='view__item' key={Math.random()}><button><i class="fas fa-plus"></i> key generator</button></div>
                </Link>
            })}
        </div> || <p>there are no registered deployments</p>}
    </section>
})