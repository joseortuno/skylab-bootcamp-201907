import './index.sass'
import React, { useState, useEffect } from 'react'
import logic from '../../logic'
import { withRouter } from 'react-router-dom'
import moment from 'moment'


export default withRouter(function ({ onDate, history }) {
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
            setValueSelect(deployments[0].id)
        })()
    }, [history.location])

    function handleSubmit(event) {
        event.preventDefault()

        const { target: { validFromDate: { value: validFromDate }, validFromTime: { value: validFromTime }, validUntilDate: { value: validUntilDate }, validUntilTime: { value: validUntilTime }, alias: { value: alias }, email: { value: email } } } = event

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

    const handleOnBack = () => history.go(-1)

    return <section className="register-key">
        <div className='filter view_navigate'>
            <p>key register | <button onClick={handleOnBack}> <i class="fas fa-chevron-left"></i> on back</button></p>
        </div>
        <section>
            <form onSubmit={handleSubmit}>
                <label>
                    valid from:
                    <input type="date" name="validFromDate" value={onDate} onChange={event => {
                        event.preventDefault()
                        setGetDate(event.target.value)
                    }} required />
                    <input type="time" name="validFromTime" onChange={event => {
                        event.preventDefault()
                        setGetHour(event.target.value)
                    }} required />
                </label>
                <label>
                    valid until:
                    <input type="date" name="validUntilDate" value={onDate || getDate2 || getDate} onChange={event => {
                        event.preventDefault()
                        setGetDate2(event.target.value)
                    }} required />
                    <input type="time" name="validUntilTime" value={getHour2 || handleHours()} onChange={event => {
                        event.preventDefault()
                        setGetHour2(event.target.value)
                    }} required />
                </label>
                <label>
                    guest:
                <input type="text" name="alias" placeholder="name" required />
                    <input type="email" name="email" placeholder="email" required />
                </label>
                <label>
                    deployment:
                    {deployments && <select onChange={event => {
                        event.preventDefault()
                        event.target.value ? setValueSelect(event.target.value) : setValueSelect(deployments[0].id)
                    }}>
                        {deployments.map(deployment => {
                            return <option value={deployment.id}>{deployment.alias}</option>
                        }
                        )}
                    </select> || <p>there are no deployments</p>}
                </label>
                <button><i class="fas fa-chevron-right"></i> save</button>
            </form>
        </section>
    </section>
})