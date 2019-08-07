class App extends React.Component {
    constructor() {
        super()

        this.state = { view: 'landing' }

        this.handleLogin = this.handleLogin.bind(this)
    }

    handleLogin(email, password) {

        try {
            logic.login(email, password)
            this.setState({view: 'landing'})
        }
        catch {
            console.error(error)
        }


    }



    render() {

        return <>
            { view === 'landing' && <Landing/> }
            { view === 'register' && <Register/> }
            { view === 'registerSuccess' && <RegisterSuccess/> }
            { view === 'login' && <Login onLogin={this.handleLogin}/> }
        </>
    }
}