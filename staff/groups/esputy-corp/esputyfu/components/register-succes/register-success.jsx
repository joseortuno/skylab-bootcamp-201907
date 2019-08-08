function RegisterSuccess(props) {
    return <div class='container'>
        <p class='container__p'>
        Gracias por registrarse, puede proceder a <a class='container __a' href="" onClick={event => {
            event.preventDefault()
            props.onLogin()
        }}>Iniciar Sesión</a>.
    </p>
    </div>
}