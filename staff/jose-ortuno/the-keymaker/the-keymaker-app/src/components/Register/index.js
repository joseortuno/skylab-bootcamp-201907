import './index.sass'
import React from 'react'

export default function ({ onBack, onRegister }) {
    return <>
        <h2>Register</h2>
        <form onSubmit={event => {
            event.preventDefault()

            const { target: { alias: { value: alias }, email: { value: email }, password: { value: password }, repassword: { value: repassword } } } = event

            onRegister(alias, email, password, repassword)
        }}>
            <input type="text" name="alias" />
            <input type="email" name="email" />
            <input type="password" name="password" />
            <input type="password" name="repassword" />
            <button><i class="fas fa-chevron-right"></i> register</button>
        </form>
        <a href="#" onClick={event => {
            event.preventDefault()

            onBack()
        }}>Go back</a>
    </>
}