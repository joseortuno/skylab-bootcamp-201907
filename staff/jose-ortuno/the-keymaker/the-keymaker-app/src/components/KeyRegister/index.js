import React, { useState, useEffect } from 'react'
import logic from '../../logic'
import { withRouter } from 'react-router-dom'
import moment from 'moment'


export default withRouter(function ({ onDate, history }) {
    const [view, setView] = useState('register')
    const [deployments, setDeployments] = useState(undefined)
    const [valueSelect, setValueSelect] = useState(undefined)
    const [getDate, setGetDate] = useState(undefined)
    const [getDate2, setGetDate2] = useState(undefined)
    const [getHour, setGetHour] = useState(undefined)
    const [getHour2, setGetHour2] = useState(undefined)

    useEffect(() => {
        (async () => {
            const deployments = await logic.retrieveDeployments()
            setDeployments(deployments)
            if (deployments.length) {
                setValueSelect(deployments[0].id)
                setView('register')
                if (moment(onDate).diff(moment(new Date), 'days') < 0) setView('error date')
            } else {
                setView('error')
            }
        })()
    }, [history.location])

    function handleSubmit(event) {
        event.preventDefault()

        const { target: { validFromDate: { value: validFromDate }, validFromTime: { value: validFromTime }, validUntilDate: { value: validUntilDate }, validUntilTime: { value: validUntilTime }, alias: { value: alias }, email: { value: email } } } = event
        debugger
        const validFrom = new Date(`${validFromDate} ${validFromTime}`)
        const validUntil = new Date(`${validUntilDate} ${validUntilTime}`)

        handleRegisterKey(validFrom, validUntil, alias, email, valueSelect)
    }

    const handleRegisterKey = async (validFrom, validUntil, alias, email, valueSelect) => {
        try {
            const { message } = await logic.registerKey(validFrom, validUntil, alias, email, valueSelect)
            console.log(message)
            history.push('/deployments/keys')
        } catch ({ message }) {
            console.error(message)
        }
    }

    const handleHours = () => {
        return moment(getHour, "hh:mm A").add(1, 'hours').format('HH:mm')
    }

    const handleGoToRegisterDeployment = () => {
        history.push('/deployments/register')
    }

    const handleOnBack = () => history.go(-1)

    return <>
        {view === 'register' && <section className="register-key">
            <div className='view__navigate'>
                <p>key register | <button onClick={handleOnBack}> <i class="fas fa-chevron-left"></i> on back</button></p>
            </div>
            <section>
                <form className="register-key__form" onSubmit={handleSubmit}>
                    <label>valid from:</label>
                    <input type="date" name="validFromDate" value={onDate} onChange={event => {
                        event.preventDefault()
                        setGetDate(event.target.value)
                    }} required />
                    <input type="time" name="validFromTime" onChange={event => {
                        event.preventDefault()
                        setGetHour(event.target.value)
                    }} required />
                    <label>valid until:</label>
                    <input type="date" name="validUntilDate" value={onDate || getDate2 || getDate} onChange={event => {
                        event.preventDefault()
                        setGetDate2(event.target.value)
                    }} required />
                    <input type="time" name="validUntilTime" value={getHour2 || handleHours()} onChange={event => {
                        event.preventDefault()
                        setGetHour2(event.target.value)
                    }} required />
                    <label>guest:</label>
                    <input type="text" name="alias" placeholder="name" required />
                    <input type="email" name="email" placeholder="email" required />
                    <label>deployment:</label>
                    {deployments && <select onChange={event => {
                        event.preventDefault()
                        event.target.value ? setValueSelect(event.target.value) : setValueSelect(deployments[0].id)
                    }}>
                        {deployments.map(deployment => {
                            return <option value={deployment.id}>{deployment.alias}</option>
                        }
                        )}
                    </select> || <p>there are no deployments</p>}
                    <button className="register__button"><i class="fas fa-chevron-right"></i> save</button>
                </form>
            </section>
        </section>}
        {view === 'error' && <section>
            <p>in order generate keys, first create deployments</p>
            <button onClick={handleGoToRegisterDeployment} ><i class="fas fa-plus"></i> deployments</button>
        </section>}
        {view === 'error date' && <section>
            <p>you have chosen a date before the current one. try again</p>
            <button onClick={handleOnBack} ><i class="fas fa-chevron-right"></i> return</button>
        </section>}
    </>
})