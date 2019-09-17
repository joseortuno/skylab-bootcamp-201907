import './index.sass'
import React, { useState, useEffect } from 'react'
import logic from '../../logic'
import { withRouter, Link } from 'react-router-dom'
import { random } from 'the-keymaker-utils'

export default withRouter(function ({ onResults, history }) {
    const [keys, setKeys] = useState(undefined)
    const [deployments, setDeployments] = useState(undefined)
console.log(onResults)
    useEffect(() => {
        (async () => {
            debugger
            // const keys = await logic.searchKeys(onResults)
            debugger
            // debugger
            // if(!keys === undefined){
            //     const keysArr = keys.sort(function (a, b) {
            //         return (b.created_at - a.created_at)
            //     })
            //     setKeys(keysArr)
            // }

            // const deployments = await logic.searchDeployments(onResults)
            // if(!deployments.length === 0) {
            //     setDeployments(deployments)
            //     const deploymentsArr = deployments.sort(function (a, b) {
            //         return (b.created_at - a.created_at)
            //     })
            //     setDeployments(deploymentsArr)
            // }

        })()
    }, [])

    const handleGoToRegisterDeployment = () => {
        history.push('/deployments/register')
    }

    const handleGoToRegisterKey = () => {
        history.push('/deployments/keys/register')
    }

    const handleGoToCalendar = () => {
        history.push('/deployments/keys/calendar')
    }

    return <section className='search view'>
        <div className='filter view_navigate'>
            <p>search: <button onClick={handleGoToRegisterDeployment}><i class="fas fa-plus"></i> deployment</button> <button onClick={handleGoToRegisterKey}>+ key</button> <button onClick={handleGoToCalendar}>+ calendar</button></p>
        </div>
        <h2>result keys:</h2>
        {keys && <div className='view_list'>
            <div className="view__column" key={`${random.number(0, 99)}`}>
                <div className='view__title' key={`${random.number(0, 99)}`}>guest</div>
                <div className='view__title' key={`${random.number(0, 99)}`}>deployment</div>
                <div className='view__title' key={`${random.number(0, 99)}`}>init</div>
                <div className='view__title' key={`${random.number(0, 99)}`}>expires</div>
                <div className='view__title' key={`${random.number(0, 99)}`}>status</div>
            </div>
            {keys.map(key => {
                return <Link key={key.id} to={`/deployments/keys/detail/${key.id}`} >
                    <div className='view_item' key={`${random.number(0, 99)}-${key.id}`}>{key.alias_guest}</div>
                    <div className='view_item' key={`${random.number(0, 99)}-${key.id}`}>{key.deloyment === '/img/user' && 'no' || 'yes'}</div>
                    <div className='view_item' key={`${random.number(0, 99)}-${key.id}`}>{key.valid_from}</div>
                    <div className='view_item' key={`${random.number(0, 99)}-${key.id}`}>{key.valid_until}</div>
                    <div className='view_item' key={`${random.number(0, 99)}-${key.id}`}>{key.status}</div>
                </Link>
            })}
        </div> || <p>there are no keys result</p>}
        <h2>result keys:</h2>
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
        </div> || <p>there are no deployments result</p>}
    </section>
})