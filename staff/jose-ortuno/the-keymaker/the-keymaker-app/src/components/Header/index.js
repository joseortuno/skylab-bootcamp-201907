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

    return <header className="header header__home">
        <Link to="/deployments"><h1 className="header__logo">the keymaker</h1></Link>

        <nav className="menu">
            <ul>
                <li className="menu__button"><Link to="/deployments"><i className="fas fa-home"></i></Link></li>
                <li className="menu__button"><Link  to="/deployments/keys"><i className="fas fa-key"></i></Link></li>
                <li className="menu__button"><Link to="/deployments/keys/calendar"><i className="fas fa-calendar-times"></i></Link></li>
                <li className="menu__image">{user && <img src={user.logo} />}</li>
                <li className="menu__button"><a  href="" onClick={goOnLogout}><i className="fas fa-sign-out-alt"></i></a></li>
            </ul>
        </nav>
    </header>
}