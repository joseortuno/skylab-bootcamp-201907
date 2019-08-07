function Register({ onRegister, onBack }) {
    return <>
        <h1>Register</h1>
        <form onSubmit={event => {
            event.preventDefault()

            const name = event.target.name.value
            const surname = event.target.surname.value
            const email = event.target.email.value
            const password = event.target.password.value
            const repassword = event.target.repassword.value

            onRegister(name, surname, email, password, repassword)
        }}>
            <label>Name<input type="text" name="name" /></label>
            <label>Surname<input type="text" name="surname" /></label>
            <label>E-mail<input type="email" name="email" /></label>
            <label>Password<input type="password" name="password" /></label>
            <label>Repeat Password<input type="password" name="repassword" /></label>
            <button>Register</button>
        </form>
        <a href="" onClick={event => {
            event.preventDefault()
            onBack()
        }}>Go back</a>
    </>
}