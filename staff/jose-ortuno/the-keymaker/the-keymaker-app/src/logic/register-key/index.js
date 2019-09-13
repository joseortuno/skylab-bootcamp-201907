// const REACT_APP_API_URL = process.env.REACT_APP_API_URL

export default function (validFrom, validUntil, aliasGuest, emailGuest, deploymentId) {
    // validate fields

    return (async () => {
        const response = await fetch(`http://localhost:8080/api/key`, {
            method: 'post',
            headers: {
                'content-type': 'application/json', 
                'authorization': `bearer ${this.__token__}`
            },
            body: JSON.stringify({ validFrom, validUntil, aliasGuest, emailGuest, deploymentId })
        })

        if (response.status !== 201) {
            const { error } = await response.json()

            throw Error(error)
        }
        const _response = await response.json()
        return _response
    })()
}