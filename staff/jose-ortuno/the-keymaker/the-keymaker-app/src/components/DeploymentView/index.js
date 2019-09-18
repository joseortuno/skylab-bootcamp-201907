import React from 'react'
import { random } from 'the-keymaker-utils'
import moment from 'moment'

export default function ({ onDeployment }) {
    let createdAt

    if (onDeployment) {
        createdAt = moment(onDeployment.created_at).format('HH:mm DD-MM-YYYY')
    }

    return <ul>
        <li key={`${random.number(0, 99)}-${onDeployment.id}`} >{onDeployment.alias}</li>
        <li key={`${random.number(0, 99)}-${onDeployment.id}`}><img src={onDeployment.logo} /></li>
        <li key={`${random.number(0, 99)}-${onDeployment.id}`}>created at: {createdAt}</li>
    </ul>
}