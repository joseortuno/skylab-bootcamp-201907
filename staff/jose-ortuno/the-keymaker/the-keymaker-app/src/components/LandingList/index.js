import React from 'react'

export default function ({onRegister, onLogin}) {

    return <>
          <ul className="landing__list">
            <li className="landing__item"><a href="" onClick={onRegister}>
              <i class="fas fa-chevron-right"></i> Register</a>
            </li>
            <li className="landing__item"><a href="" onClick={onLogin}>
              <i class="fas fa-chevron-right"></i> Login</a>
            </li>
          </ul>
    </>
}