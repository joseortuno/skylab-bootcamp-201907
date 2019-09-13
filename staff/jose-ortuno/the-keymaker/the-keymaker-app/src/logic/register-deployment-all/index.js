// const REACT_APP_API_URL = process.env.REACT_APP_API_URL

export default function (alias, status, longitude, latitude) {
    // validate fields
    const convert = (name, value) => {
        if(name === 'number') return Number(value)
        if(name === 'boolean') {
            if(value === 'true') return true
            if(value === 'false') return false
        }
    }

    longitude = convert('number', longitude)
    latitude = convert('number', latitude)
    status = convert('boolean', status)

    return (async () => {
        const response = await fetch(`http://localhost:8080/api/deployment`, {
            method: 'post',
            headers: {
                'content-type': 'application/json', 
                'authorization': `bearer ${this.__token__}`
            },
            body: JSON.stringify({ alias, status, longitude, latitude })
        })

        if (response.status !== 201) {
            const { error } = await response.json()

            throw Error(error)
        }
        const _response = await response.json()
        return _response
    })()
}