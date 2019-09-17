import { validate } from 'the-keymaker-utils'
const REACT_APP_API_URL = process.env.REACT_APP_API_URL

export default function (query) {
    // validate fields
    debugger
    return (async () => {
        const response = await fetch(`${REACT_APP_API_URL}/keys/search/${query}`, {
            method: 'get',
            headers: {
                authorization: `bearer ${this.__token__}`
            }
        })

        if (response.status !== 200) {
            const { error } = await response.json()

            throw Error(error)
        }

        const { key }  = await response.json()
        
        return key
     })()
}