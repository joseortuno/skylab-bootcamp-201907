import React from 'react'
import logic from '../../logic'
import { withRouter } from 'react-router-dom'

export default withRouter(function ({history}) {
    function handleSubmit(event) {
        event.preventDefault()

        const { target: { logo: { value: logo }, name: { value: name }, longitude: { value: longitude }, latitude: { value: latitude }, status: { value: status } } } = event
        
        handleRegisterDeployment(logo, name, status, longitude, latitude)
    }

    const handleRegisterDeployment = async (logo, name, status, longitude, latitude) => {
        try {
            const deployments = await logic.retrieveDeploymentAll()

            const { key } = await logic.registerKey(validFrom, validUntil, aliasGuest, emailGuest, deploymentId)
            
            
            // const response = await logic.registerDeploymentImage(deployment.id, logo)
            history.push('/home')
        } catch ({ message }) {
            console.error(message)
        }
    }

    return <>
        <h2>Register Deployment</h2>
        <form onSubmit={handleSubmit}>
            <input type="file" name="logo"></input>
            <input type="text" name="name" placeholder="name" />
            <input type="text" name="longitude" placeholder="longitude" />
            <input type="text" name="latitude" placeholder="latitude" />
            <input type="checkbox" name="status" value="true"></input>
            <button>> save</button>
        </form>
    </>
})