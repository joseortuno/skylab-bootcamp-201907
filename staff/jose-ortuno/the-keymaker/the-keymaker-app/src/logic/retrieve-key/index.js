// const REACT_APP_API_URL = process.env.REACT_APP_API_URL

export default function (keyId) {
    // validate fields
    return (async () => {
        const response = await fetch(`http://localhost:8080/api/key/${keyId}`, {
            method: 'get'
        })

        if (response.status !== 200) {
            const { error } = await response.json()

            throw Error(error)
        }

        const { key }  = await response.json()

        return key
     })()
}