import React from 'react'

export default function ({ onBack, onLogin }) {
    return <>
        <h2>Login</h2>
        <form onSubmit={event => {
            event.preventDefault()

            const { target: { email: { value: email }, password: { value: password } } } = event

            onLogin(email, password)
        }}>
            <input type="email" name="email" placeholder="email" />
            <input type="password" name="password" placeholder="password"/>
            <button><i class="fas fa-chevron-right"></i> login</button>
        </form>
        <a href="#" onClick={event => {
            event.preventDefault()

            onBack()
        }}>Go back</a>
    </>
}