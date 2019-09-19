import React from 'react'

export default function ({ onBack, onRegister }) {
    return <div className="landing__list">
        <h2>Register</h2>
        <form className="landing__form" onSubmit={event => {
            event.preventDefault()

            const { target: { alias: { value: alias }, email: { value: email }, password: { value: password }, repassword: { value: repassword } } } = event

            onRegister(alias, email, password, repassword)
        }}>
            <input type="text" name="alias" placeholder="name" />
            <input type="email" name="email" placeholder="email" />
            <input type="password" name="password" placeholder="password" />
            <input type="password" name="repassword" placeholder="repeat password" />
            <button><i class="fas fa-chevron-right"></i> register</button>
        </form>
        <a href="#" onClick={event => {
            event.preventDefault()

            onBack()
        }}>Go back</a>
    </div>
}