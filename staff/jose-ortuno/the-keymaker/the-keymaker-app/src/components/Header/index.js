import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logic from '../../logic'

// COMPONETS
import Search from '../Search'

export default function ({ goOnLogout }) {
    const [user, setUser] = useState(undefined)

    useEffect(() => {
        (async () => {
            const user = await logic.retrieveUser()

            setUser(user)
        })()
    }, [])

    return <header>
        <Search />
        <nav>
            <ul>
                <li><Link to="/keys">keys</Link></li>
                <li><Link to="/deployments">deployments</Link></li>
                <li>info</li>
                <li><button onClick={goOnLogout}>> logout</button></li>
            </ul>
        </nav>
        <div>{user && <img src={user.logo} />}</div>
    </header>
}