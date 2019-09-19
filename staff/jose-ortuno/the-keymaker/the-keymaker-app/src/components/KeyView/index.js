import React from 'react'
import { random } from 'the-keymaker-utils'
import moment from 'moment'

export default function ({ onKey }) {
    let validFrom
    let validUntil

    if (onKey) {
        validFrom = moment(onKey.valid_from).format('HH:mm DD-MM-YYYY')
        validUntil = moment(onKey.valid_until).format('HH:mm DD-MM-YYYY')
    }

    return <div className="view__list">
        <ul>
            <li className='view__item' key={`${random.number(0, 99)}-${onKey.id}`}><i className="fas fa-key"></i> {onKey.alias_guest}</li>
            <li className='view__item' key={`${random.number(0, 99)}-${onKey.id}`}>{onKey.email_guest}</li>
            <li className='view__item' key={`${random.number(0, 99)}-${onKey.id}`}>valid from: {validFrom}</li>
            <li className='view__item' key={`${random.number(0, 99)}-${onKey.id}`}>valid until: {validUntil}</li>
            <li className={`view__item`} key={`${random.number(0, 99)}-${onKey.id}`}>status: <span className={`keys__status--${onKey.status}`}>{onKey.status}</span></li>
        </ul>
    </div>
}