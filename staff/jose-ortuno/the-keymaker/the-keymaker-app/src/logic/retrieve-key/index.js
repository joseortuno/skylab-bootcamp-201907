import { validate } from 'the-keymaker-utils'
const REACT_APP_API_URL = process.env.REACT_APP_API_URL

export default function (keyId) {
    // validate fields
    return (async () => {
        const response = await fetch(`${REACT_APP_API_URL}/key/${keyId}`, {
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