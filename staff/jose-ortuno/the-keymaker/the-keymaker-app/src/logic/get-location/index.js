const API_KEY_GOOGLE_MAPS = 'AIzaSyDdx1PrjoxeKY7po8NgDapK9Vd4J8GLFlI'

export default function async(address) {
    debugger
    // validate fields
    return (async () => {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY_GOOGLE_MAPS}`, {
            method: 'get'
        })

        if (response.status !== 200) {
            const { error } = await response.json()

            throw Error(error)
        }

        const result = await response.json()

        const getAddress = result.results[0].formatted_address
        const coordinates = result.results[0].geometry.location
        return { getAddress, coordinates }
    })()

}