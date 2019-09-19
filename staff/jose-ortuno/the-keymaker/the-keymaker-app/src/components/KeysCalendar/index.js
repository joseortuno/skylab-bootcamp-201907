import React, { useState, useEffect } from 'react'
import logic from '../../logic'
import { withRouter, Link } from 'react-router-dom'
import moment from "moment"

export default withRouter(function ({ onEvent, history }) {
    // STATES
    const [currentDate, setCurrentDate] = useState(moment())
    const [monthKeys, setMonthKeys] = useState([])

    useEffect(() => {
        (async () => {
            try {
                const keys = await logic.retrieveKeys()

                const monthKeys = keys.filter(task => moment(currentDate).isSame(keys.valid_from, 'month'))
                setMonthKeys(monthKeys)
            } catch ({ message }) {
                console.error(message)
            }
        })()
    }, [])

    // HANDLES
    const handleGoToRegisterKey = () => {
        history.push('/deployments/keys/register')
    }

    const handleGoToRegisterDeployment = () => {
        history.push('/deployments/register')
    }

    function handleGoToNextMonth(event) {
        event.preventDefault()
        setCurrentDate(moment(currentDate).add(1, 'months'))
    }
    function handleGoToPreviousMonth(event) {
        event.preventDefault()

        setCurrentDate(moment(currentDate).subtract(1, 'months'))
    }

    function handleDayKeys(dataDate) {
        return monthKeys.map(key => {
            let keyDay = moment(key.valid_from).format('YYYY MMMM D')
            let currentDay = moment(dataDate).format('YYYY MMMM D')
            const dateFormat =  moment(key.valid_from).format('HH:mm')
            if (keyDay === currentDay) {
                return <div className="calendar__key" onClick={event => {
                    event.preventDefault()
                    event.stopPropagation()

                    history.push(`/deployments/keys/detail/${key.id}`)
                }}><i class="fas fa-key"></i> {key.alias_guest} 
                <br /><i class="fas fa-home"></i> {key.deployment.alias} <br />(<i class="fas fa-calendar-check"></i> {dateFormat}) </div>
            }
        })
    }

    // RENDERS
    const header = () => {
        return (
            <>
                <h2>calendar</h2>
                <i class="fas fa-caret-left" onClick={handleGoToPreviousMonth}></i> <h3 class="month__title"> {moment(currentDate).format("MMMM")} </h3> <i class="fas fa-caret-right" onClick={handleGoToNextMonth}></i>
                <p class="month__year">{moment(currentDate).format("YYYY")}</p>
                <button onClick={handleGoToRegisterKey}><i class="fas fa-plus"></i> key</button>
                <button onClick={handleGoToRegisterDeployment}><i class="fas fa-plus"></i> deployment</button>
            </>
        )
    }

    const week = () => {
        const days = []
        const startDate = moment(currentDate).startOf('week')

        for (let i = 0; i < 7; i++) {
            days.push(
                <div>
                    {startDate.add(1, 'days').format('ddd')}
                </div>
            )
        }
        return <div class="calendar__header">{days}</div>
    }

    const days = () => {
        const monthStart = moment(currentDate).startOf('month'),
            monthEnd = moment(currentDate).endOf('month'),
            endDate = moment(monthEnd).endOf('week'),
            rows = []

        let days = []
        let formattedDate = ''
        let eventDate = ''
        let first = monthStart
        switch (first.day()) {
            case 1:
                first.add(7, 'days')
                break
            case 2:
                first.add(6, 'days')
                break
            case 3:
                first.add(5, 'days')
                break
            case 4:
                first.add(4, 'days')
                break
            case 5:
                first.add(3, 'days')
                break
            case 6:
                first.add(2, 'days')
                break
            case 0:
                first.add(1, 'days')
        }

        if (monthStart.day() !== '1') {
            first = moment(first).subtract(1, 'week')
            while (first <= moment(first).endOf('week').day()) {
                for (let i = 0; i < 7; i++) {
                    formattedDate = first.format('D')
                    eventDate = first.format("YYYY-MM-DD")
                    const dataDate = first.format()
                    days.push(
                        <a onClick={onEvent} data-day={eventDate} className={!moment(currentDate).isSame(dataDate, 'month')
                        ? 'calendar__disabled' 
                        : moment().isSame(dataDate, 'day')
                            ? 'calendar__selected'
                            : 'calendar__day day'} >
                            {formattedDate}
                            {monthKeys && <div>{handleDayKeys(dataDate)}</div>}
                        </a>
                    )
                    first = first.add(1, 'days')
                }
            }
        }

        while (first <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = first.format('D')
                eventDate = first.format("YYYY-MM-DD")
                const dataDate = first.format()
                days.push(
                    <a onClick={onEvent} data-day={eventDate} className={!moment(currentDate).isSame(dataDate, 'month')
                        ? 'calendar__disabled' 
                        : moment().isSame(dataDate, 'day')
                            ? 'calendar__selected'
                            : 'calendar__day day'}>
                        {formattedDate}
                        {monthKeys && <Link>{handleDayKeys(dataDate)}</Link>}
                    </a>
                )
                first = first.add(1, 'days')
            }
            rows.push(<div class="calendar__week"> {days} </div>)
            days = []
        }
        return <div>{rows}</div>
    }

    return <section className="calendar">
        <div className="calendar__header">{header()}</div>
        <div>{week()}{days()}</div>
    </section>
})