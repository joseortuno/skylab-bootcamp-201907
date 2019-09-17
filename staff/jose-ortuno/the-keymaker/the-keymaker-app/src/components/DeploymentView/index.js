import React from 'react'
import { random } from 'the-keymaker-utils'
import './index.sass'

export default function ({ onDeployment }) {
    return <ul>
        <li key={`${random.number(0, 99)}-${onDeployment.id}`} >{onDeployment.alias}</li>
        <li key={`${random.number(0, 99)}-${onDeployment.id}`}><img src={onDeployment.logo} /></li>
        <li key={`${random.number(0, 99)}-${onDeployment.id}`}>{onDeployment.created_at}</li>
    </ul>
}