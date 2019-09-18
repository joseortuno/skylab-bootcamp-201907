import React from 'react'
import { random } from 'the-keymaker-utils'
import moment from 'moment'

export default function ({ onDeployment }) {
    let createdAt
    if (onDeployment) {
        createdAt = moment(onDeployment.created_at).format('HH:mm DD-MM-YYYY')
    }

    const { location: { longitude, latitude } } = onDeployment

    return <div className="view__detail">
    <img className="view__image" src={onDeployment.logo} />
        <ul>
            <li className="view__element" key={`${random.number(0, 99)}-${onDeployment.id}`} >{onDeployment.alias}</li>
            <li className="view__element" key={`${random.number(0, 99)}-${onDeployment.id}`}>created at: {createdAt}</li>
            <li className="view__element" key={`${random.number(0, 99)}-${onDeployment.id}`}>address: {onDeployment.address}</li>
            <li className="view__element" key={`${random.number(0, 99)}-${onDeployment.id}`}>location:{longitude} (longitude), {latitude} (latitude)</li>
        </ul>
    </div>
}