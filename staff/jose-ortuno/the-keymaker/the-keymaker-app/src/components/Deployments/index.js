import './index.sass'
import React, { useState, useEffect } from 'react'
import logic from '../../logic'
import { withRouter, Link } from 'react-router-dom'

// COMPONETS
import Search from '../Search'
import DeploymentView from '../DeploymentView'

export default withRouter(function ({ history }) {
    const [deployments, setDeployments] = useState(undefined)
    const [deploymentResults, setDeploymentResults] = useState(undefined)
    const [view, setView] = useState('deployments')

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

    const handleViewDeploymentsAll = () => {
        setView('deployments')
    }

    const handleSearchQuery = async (query) => {
        try {
            const deploymentResults = await logic.searchDeployments(query)
            setDeploymentResults(deploymentResults)
            setView('results')
        } catch ({ message }) {
            console.error(message)
        }
    }

    return <section className='deployments view'>
        <div className='view__navigate'>
            <p>search deployment: </p>
            <Search onSearch={handleSearchQuery} />
            {view === 'result' && <button onClick={handleViewDeploymentsAll} ><i class="fas fa-plus"></i> all</button>}
            <i class="fas fa-grip-lines-vertical"></i>
            <button onClick={handleGoToRegisterDeployment}><i class="fas fa-plus"></i> deployment</button>
        </div>

        {view === 'deployments' && <>
            {deployments && deployments.map(deployment => {
                return <Link className="view__element" key={deployment.id} to={`/deployments/detail/${deployment.id}`} >
                    <DeploymentView onDeployment={deployment} />
                </Link>
            }) || <p><i class="fas fa-comment-dots"></i> there are no registered deployments</p>}
        </>}

        {view === 'results' && <>
            <h2>results:</h2>
            {deploymentResults && deployments.map(deployment => {
                return <Link className="view__element" key={deployment.id} to={`/deployments/detail/${deployment.id}`} >
                    <DeploymentView onDeployment={deployment} />
                </Link>
            }) || <p><i class="fas fa-comment-dots"></i> there are no results to search</p>}
        </>}

    </section>
})