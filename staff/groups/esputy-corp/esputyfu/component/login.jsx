function Login(onLogin, onBack) {
    return <>
        <h1>Login</h1>
        <form onSubmit={event => {
            event.preventDefault()

            const email = event.target.email.value
            const password = event.target.email.value

            onLogin(email, password)
        }}>
            <label>E-mail<input type="email" name="email" /></label>
            <label>Password<input type="password" name="password" /></label>
            <button>Login</button>
        </form>
        <a href="" onClick={event => {
            event.preventDefault()
            onBack()
        }}>Go back</a>
    </>
}