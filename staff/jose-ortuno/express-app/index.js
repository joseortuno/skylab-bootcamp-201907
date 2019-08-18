const express = require('express')
const { Html, Header, DuckResults, DuckDetail, Register, RegisterSuccess, Login, DuckFavorites } = require('./components')
const session = require('express-session')
const logic = require('./logic')
const bodyParser = require('body-parser')

const formBodyParser = bodyParser.urlencoded({ extended: false })

const { HOME, SEARCH, SIGN_IN, SIGN_UP, SIGN_OUT, DETAIL, TOGGLE_FAV, FAVORITES, SELECT_LANG } = require('./constants')

const { argv: [, , port] } = process

const app = express()

app.use(session({
    secret: 's3cr3t th1ng',
    saveUninitialized: true,
    resave: true
}))

app.get(HOME, (req, res) => {
    const { session: { userId, token, query, lang = 'en' } } = req

    req.session.view = HOME

    try {
        if (userId && token)
            logic.retrieveUser(userId, token)
                .then(user => res.send(Html(Header(user.name, query, lang))))
                .catch(error => { throw error })
        else res.send(Html(Header(undefined, query, lang)))
    } catch (error) { throw error }

})

app.get(SEARCH, (req, res) => {
    const { query: { q: query }, session: { userId, token, lang = 'en' } } = req

    req.session.query = query
    req.session.view = `${SEARCH}?q=${query}`

    try {
        if (userId && token)
            Promise.all([
                logic.retrieveUser(userId, token),
                logic.searchDucks(userId, token, query)
            ])
                .then(([user, ducks]) => res.send(Html(`${Header(user.name, query, lang)}${DuckResults(ducks)}`)))
                .catch(error => { throw error })
        else
            logic.searchDucks(undefined, undefined, query)
                .then(ducks => res.send(Html(`${Header(undefined, query, lang)}${DuckResults(ducks)}`)))
    } catch (error) { throw error }
})

app.get(`${DETAIL}/:id`, (req, res) => {
    const { params: { id: duckId }, session: { userId, token, query, lang = 'en' } } = req

    req.session.view = `${DETAIL}/${duckId}`
    
    try {
        if (userId && token)
            Promise.all([
                logic.retrieveUser(userId, token),
                logic.retrieveDuck(userId, token, duckId)
            ])
                .then(([user, duck]) => res.send(Html(`${Header(user.name, query, lang)}${DuckDetail(duck, lang, query)}`)))
                .catch(error => { throw error })
        else
            logic.retrieveDuck(undefined, undefined, duckId)
                .then(duck => res.send(Html(`${Header(undefined, query, lang)}${DuckDetail(duck, lang, query)}`)))
    } catch (error) { throw error }
})

app.get(SIGN_UP, (req, res) => {
    const { session: { lang = 'en', view } } = req

    res.send(Html(Register(lang, view)))
})

app.post(SIGN_UP, formBodyParser, (req, res) => {
    const { body } = req

    const { name, surname, email, password, repassword } = body

    try {
        logic.registerUser(name, surname, email, password, repassword)
            .then(() => res.send(Html(RegisterSuccess(SIGN_IN))))
            .catch(error => { throw error })
    } catch (error) { throw error }
})

app.get(SIGN_IN, (req, res) => {
    const { session: { lang = 'en', view } } = req

    res.send(Html(Login(lang, view)))
})

app.post(SIGN_IN, formBodyParser, (req, res) => {
    const { body, session } = req

    const { email, password } = body

    try {
        logic.authenticateUser(email, password)
            .then(({ id, token }) => {
                session.userId = id
                session.token = token

                res.redirect(HOME)
            })
            .catch(error => { throw error })
    } catch (error) { throw error }
})

app.post(SIGN_OUT, (req, res) => {
    const { session } = req

    delete session.userId
    delete session.token

    res.redirect(HOME)
})

app.post(TOGGLE_FAV, formBodyParser, (req, res) => {
    const { body: { id }, session: { userId, token, query, view } } = req

    if (userId && token)
        try {
            logic.toggleFavDuck(userId, token, id)
                .then(() => {
                    if (view.search(SEARCH) > -1) res.redirect(`${SEARCH}/?q=${query}`)
                    if (view.search(id) > -1) res.redirect(`${DETAIL}/${id}`)
                    if (view.search(FAVORITES) > -1) res.redirect(FAVORITES)
                })
                .catch(error => { throw error })
        } catch (error) { throw error }
    else res.redirect(SIGN_IN)
})

app.get(FAVORITES, formBodyParser, (req, res) => {
    const { session: { userId, token, query, lang = 'en' } } = req

    req.session.view = FAVORITES

    try {
        Promise.all([
            logic.retrieveUser(userId, token),
            logic.retrieveFavDucks(userId, token)
        ])
            .then(([user, ducks]) => res.send(Html(`${Header(user.name, query, lang)}${DuckFavorites(ducks, lang)}`)))
    } catch (error) { throw error }
})

app.post(SELECT_LANG, formBodyParser, (req, res) => {
    const { body: { lang }, session: { view } } = req

    req.session.lang = lang

    res.redirect(view)

})

app.listen(port)