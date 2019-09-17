import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logic from '../../logic'
import './index.sass'

export default function ({ goOnLogout }) {
    const [user, setUser] = useState(undefined)

    useEffect(() => {
        (async () => {
            const user = await logic.retrieveUser()

            setUser(user)
        })()
    }, [])

    return <header>
        <Link to="/deployments"><h1 className="logo">the keymaker</h1></Link>

        <nav className="menu">
            <ul>
                <li className="menu__keys"><Link to="/deployments/keys">keys</Link></li>
                <li className="menu__calendar"><Link to="/deployments/keys/calendar">calendar</Link></li>
                <li className="menu__deployments"><Link to="/deployments">deployments</Link></li>
                <li className="menu__user">{user && <img src={user.logo} />}</li>
                <li><button onClick={goOnLogout}><i class="fas fa-chevron-right"></i> logout</button></li>
            </ul>
        </nav>
    </header>
}