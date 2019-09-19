import React, { useState } from 'react'
import logic from '../../logic'
import { withRouter } from 'react-router-dom'

export default withRouter(function ({ history }) {
    const [valueSelect, setValueSelect] = useState("true")
    const [view, setView] = useState('form')
    const [data, setData] = useState()

    const handleSubmit = async (event) => {
        event.preventDefault()
        const { target: { logo: { files: [logo] }, name: { value: name }, address: { value: address } } } = event
        const { getAddress, coordinates: { lat, lng } } = await logic.getLocation(address)
        setData({ logo, name, getAddress, lng, lat })
        setView('confirm')
    }

    const handleConfirm = () => {
        const { logo, name, getAddress, lng, lat } = data
        handleRegisterDeployment(logo, name, valueSelect, getAddress, lng, lat)
    }

    const handleReturn = () => {
        setView('form')
    }

    const handleRegisterDeployment = async (logo, name, valueSelect, getAddress, longitude, latitude) => {
        try {
            const { message, deployment } = await logic.registerDeployment(name, getAddress, valueSelect, longitude, latitude)
            console.log(message)
            if (logo) {
                const response = await logic.registerDeploymentImage(deployment.id, logo)
                console.log(response)
            }
            history.push('/deployments')
        } catch ({ message }) {
            console.error(message)
        }
    }

    const handleOnBack = () => history.go(-1)

    return <section className="register-deployment">
        <div className='filter view__navigate'>
            <p>deployment register | <button onClick={handleOnBack}> <i class="fas fa-chevron-left"></i> on back</button></p>
        </div>
        {view === 'form' && <form className='register-deployment__form' method='post' onSubmit={handleSubmit} encType="multipart/form-data">
            <label>image:</label>
            <input type="file" name="logo" ></input>
            <label>name:</label>
            <input type="text" name="name" placeholder="name" required />
            <label>location address:</label>
            <input type="text" name="address" placeholder="address" />
            <select value={valueSelect} onChange={event => {
                event.preventDefault()
                const element = event.target.value
                setValueSelect(element)
            }}>
                <option value="true">active</option>
                <option value="false">inactive</option>
            </select>
            <button className="register__button"><i class="fas fa-chevron-right"></i> save</button>
        </form>}
        {view === 'confirm' && <section className="register-deployment__confirm">
            <p className="register-deployment__text">confirm location:</p>
            <p className="register-deployment__text">{data.getAddress}</p>
            <button className="register-deployment__button" onClick={handleConfirm} >yes</button>
            <button className="register-deployment__button" onClick={handleReturn} >return</button>
        </section>}
    </section>
})



