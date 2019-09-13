// const REACT_APP_API_URL = process.env.REACT_APP_API_URL

export default function (deploymentId, image) {
    //TODO:  validate fields
debugger
    // const token = logic.userCredentials
    var formData = new FormData();
    formData.append('image', image);
    //headers: { 'content-type': 'multipart/form-data', authorization: `bearer ${token}` },
    return (async () => {
        // if(image !== undefined)
        const response = await fetch(`http://localhost:8080/api/users/deployment/${deploymentId}/upload`, {
            method: 'post',
            headers: {
                'authorization': `bearer ${this.__token__}`
            },
            body: formData
        })
        debugger
        if (response.status !== 200) {
            const { error } = await response.json()
            throw new Error(error)
        } 
        const { message } = await response.json()
        debugger
        return message
    })()
}