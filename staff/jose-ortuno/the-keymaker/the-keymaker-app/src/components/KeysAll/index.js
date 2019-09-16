import './index.sass'
import React, { useState, useEffect } from 'react'
import logic from '../../logic'
import { withRouter, Link } from 'react-router-dom'
import { random } from 'the-keymaker-utils'
import moment from "moment"

export default withRouter(function ({ history }) {
    const [keys, setKeys] = useState(undefined)

    useEffect(() => {
        (async () => {
            const keys = await logic.retrieveKeys()
            const keysArr = keys.sort(function (a, b) {
                return (b.created_at - a.created_at)
            })
            keys.length === 0 && {} || setKeys(keysArr)
        })()
    }, [])

    const handleGoToRegisterKey = () => {
        history.push('/deployments/keys/register')
    }

    const handleGoToCalendar = () => {
        history.push('/deployments/keys/calendar')
    }

    return <section className='keys view'>
        <div className='filter view_navigate'>
            <p>filter keys: <button>activated</button> <button>all</button> | <button>waiting</button> <button>visited</button> <button>expired</button> <button>cancelled</button> | <button onClick={handleGoToRegisterKey}>+ key</button> <button onClick={handleGoToCalendar}>+ calendar</button></p>
        </div>
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
        </div> || <p>there are no registered keys</p>}
    </section>
})