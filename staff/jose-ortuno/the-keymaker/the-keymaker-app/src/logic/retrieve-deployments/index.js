// const REACT_APP_API_URL = process.env.REACT_APP_API_URL

export default function () {
    // validate fields

    return (async () => {
        const response = await fetch(`http://localhost:8080/api/deployments`, {
            method: 'get',
            headers: {
                authorization: `bearer ${this.__token__}`
            }
        })

        if (response.status !== 200) {
            const { error } = await response.json()

            throw Error(error)
        }

        const { deployments }  = await response.json()

        return deployments
     })()
}