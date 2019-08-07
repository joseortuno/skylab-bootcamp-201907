function RegisterSuccess({ onLogin }) {
    return <p>
        Register Succesful! You can now procceed to <a href="" onClick={event => {
            event.preventDefault()
            onLogin()
        }}>Login</a>.
    </p>
}