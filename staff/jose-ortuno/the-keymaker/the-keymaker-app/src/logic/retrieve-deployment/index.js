// const REACT_APP_API_URL = process.env.REACT_APP_API_URL

export default function (deploymentId) {
    // validate fields
    return (async () => {
        const response = await fetch(`http://localhost:8080/api/deployment/${deploymentId}`, {
            method: 'get',
            headers: {
                authorization: `bearer ${this.__token__}`
            }
        })

        if (response.status !== 200) {
            const { error } = await response.json()

            throw Error(error)
        }

        const { deployment } = await response.json()

        return deployment
     })()
}