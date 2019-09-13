import './index.sass'
import React from 'react'
import logic from '../../logic'
import { withRouter } from 'react-router-dom'

export default withRouter(function ({ toOnBack, history }) {

    function handleSubmit(event) {
        event.preventDefault()
        debugger
        const { target: { logo: { files: [logo] }, name: { value: name }, longitude: { value: longitude }, latitude: { value: latitude }, status: { value: status } } } = event

        handleRegisterDeployment(logo, name, status, longitude, latitude)
    }

    const handleRegisterDeployment = async (logo, name, status, longitude, latitude) => {
        try {
            const { deployment } = await logic.registerDeployment(name, status, longitude, latitude)
            debugger
            const response = await logic.registerDeploymentImage(deployment.id, logo)
            debugger
            history.push('/deployments')
        } catch ({ message }) {
            console.error(message)
        }
    }

    return <>
        <h2>Register Deployment</h2>
        <form method='post' onSubmit={handleSubmit} enctype="multipart/form-data">
            <label>
                image:
                <input type="file" name="logo"></input>
            </label>
            <label>
                name:
                <input type="text" name="name" placeholder="name" />
            </label>
            <label>
                location:
                <input type="text" name="longitude" placeholder="longitude" />
                <input type="text" name="latitude" placeholder="latitude" />
            </label>
            <select>
                <option value="true">active</option>
                <option value="false">inactive</option>
            </select>
            <button>> save</button>
        </form>
    </>
})