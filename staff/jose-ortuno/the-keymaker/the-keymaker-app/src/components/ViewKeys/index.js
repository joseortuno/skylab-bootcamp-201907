import './index.sass'
import React, { useState, useEffect } from 'react'
import logic from '../../logic'
import { withRouter } from 'react-router-dom'

export default withRouter(function ({ history }) {
    const [keys, setKeys] = useState(undefined)

    const handleGoToRegisterKey = () => {
        history.push('/deployments/keys/register-key')
    }

    useEffect(() => {
        (async () => {
            const keys = await logic.retrieveKeys()

            setKeys(keys)
        })()
    }, [])

    return <section className='keys view'>
        <div className='filter view_navigate'>
            <p>filter keys: <button>activated</button> <button>all</button> | <button>waiting</button> <button>visited</button> <button>expired</button> <button>cancelled</button> | <button onClick={handleGoToRegisterKey}>+ key</button></p>
        </div>
        {keys && <div className='view_list'>
            <div className="view__column" key={Math.random()}>
                <div className='view__title' key={Math.random()}>guest</div>
                <div className='view__title' key={Math.random()}>deployment</div>
                <div className='view__title' key={Math.random()}>init</div>
                <div className='view__title' key={Math.random()}>expires</div>
                <div className='view__title' key={Math.random()}>status</div>
            </div>
            {keys.map(key => {
                return <div key={Math.random()}>
                    <div className='view_item' key={Math.random()}>{key.alias_guest}</div>
                    <div className='view_item' key={Math.random()}>{key.deloyment === '/img/user' && 'no' || 'yes'}</div>
                    <div className='view_item' key={Math.random()}>{key.valid_from}</div>
                    <div className='view_item' key={Math.random()}>{key.valid_until}</div>
                    <div className='view_item' key={Math.random()}>{key.status}</div>
                </div>
            })}
        </div>}
    </section>
})