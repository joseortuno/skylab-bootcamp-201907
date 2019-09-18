import React, { useState, useEffect } from 'react'
import logic from '../../logic'
import { withRouter, Link } from 'react-router-dom'

// COMPONETS
import Search from '../Search'
import KeyView from '../KeyView'

export default withRouter(function ({ history }) {
    const [keys, setKeys] = useState(undefined)
    const [keyResults, setKeyResults] = useState(undefined)
    const [view, setView] = useState('keys')

    useEffect(() => {
        (async () => {
            try {
                const keys = await logic.retrieveKeys()
                const keysArr = keys.sort(function (a, b) {
                    return (b.created_at - a.created_at)
                })
                keys.length === 0 && {} || setKeys(keysArr)
            } catch ({ message }) {
                console.error(message)
            }
        })()
    }, [])

    const handleGoToRegisterKey = () => {
        history.push('/deployments/keys/register')
    }

    const handleGoToCalendar = () => {
        history.push('/deployments/keys/calendar')
    }

    const handleViewKeysAll = () => {
        setView('keys')
    }

    const handleSearchQuery = async (query) => {
        try {
            const keyResults = await logic.searchKeys(query)
            setKeyResults(keyResults)
            setView('results')
        } catch ({ message }) {
            if (message === 'no results') setView('results')
            console.error(message)
        }
    }

    return <section className='keys view'>
        <div className='view__navigate navigate__search'>
            <div className="navigate__item">
                <p>keys:  </p>
                <button onClick={handleGoToRegisterKey}><i class="fas fa-plus"></i> key</button>
                <button onClick={handleGoToCalendar}><i class="fas fa-chevron-left"></i> calendar</button>
            </div>
            <div className="navigate__item">
                <p>search keys: </p>
                <Search onSearch={handleSearchQuery} />
                {view === 'results' && <button onClick={handleViewKeysAll} ><i class="fas fa-plus"></i> all</button>}
            </div>
        </div>
        {view === 'results' && <h2>results:</h2>}
        <div className="view__elements">
            {view === 'keys' && <>
                {keys && keys.map(key => {
                    return <Link className="view__element" key={key.id} to={`/deployments/keys/detail/${key.id}`} >
                        <KeyView onKey={key} />
                    </Link>
                }) || <p><i class="fas fa-comment-dots"></i> there are no registered keys</p>}
            </>}

            {view === 'results' && <>
                {keyResults && keys.map(key => {
                    return <Link className="view__element" key={key.id} to={`/deployments/keys/detail/${key.id}`} >
                        <KeyView onKey={key} />
                    </Link>
                }) || <p><i class="fas fa-comment-dots"></i> there are no results to search</p>}
            </>}
        </div>

    </section>
})