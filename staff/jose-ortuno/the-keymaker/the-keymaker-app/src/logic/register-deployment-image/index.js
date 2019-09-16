// const REACT_APP_API_URL = process.env.REACT_APP_API_URL

export default function (deploymentId, image) {
    //TODO:  validate fields

    var formData = new FormData();
    formData.append('image', image);

    return (async () => {
        const response = await fetch(`http://localhost:8080/api/users/deployment/${deploymentId}/upload`, {
            method: 'post',
            headers: {
                'authorization': `bearer ${this.__token__}`
            },
            body: formData
        })
        
        if (response.status !== 200) {
            const { error } = await response.json()
            throw new Error(error)
        } 
        const { message } = await response.json()
        
        return message
    })()
}