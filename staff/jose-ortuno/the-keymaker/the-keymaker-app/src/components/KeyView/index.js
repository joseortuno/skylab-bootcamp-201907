import React from 'react'
import { random } from 'the-keymaker-utils'
import './index.sass'

export default function ({ onKey }) {
    return <ul>
        <li className='view_item' key={`${random.number(0, 99)}-${onKey.id}`}>{onKey.alias_guest}</li>
        <li className='view_item' key={`${random.number(0, 99)}-${onKey.id}`}>{onKey.deloyment === '/img/user' && 'no' || 'yes'}</li>
        <li className='view_item' key={`${random.number(0, 99)}-${onKey.id}`}>{onKey.valid_from}</li>
        <li className='view_item' key={`${random.number(0, 99)}-${onKey.id}`}>{onKey.valid_until}</li>
        <li className='view_item' key={`${random.number(0, 99)}-${onKey.id}`}>{onKey.status}</li>
    </ul>
}