// const REACT_APP_API_URL = process.env.REACT_APP_API_URL

export default function (alias, email, password, repassword) {
    // validate fields
    return (async () => {
        const response = await fetch(`http://localhost:8080/api/users`, {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ alias, email, password, repassword })
        })

        if (response.status !== 201) {
            const { error } = await response.json()

            throw Error(error)
        }
    })()
}