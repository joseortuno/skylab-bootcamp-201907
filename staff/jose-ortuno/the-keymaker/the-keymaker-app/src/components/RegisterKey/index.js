import './index.sass'
import React, { useState } from 'react'
import logic from '../../logic'
import { withRouter } from 'react-router-dom'
import moment from "moment"

export default withRouter(function ({ history }) {
    // STATES
    const [view, setView] = useState('calendar')
    const [currentDate, setCurrentDate] = useState(moment())
    const [selectedDate, setSelectedDate] = useState(new Date)

    //CALENDAR
    // handles
    // function handleMonth(event) {
    //     event.preventDefault()
    //     history.push('/month')
    // }
    // function handleWeek(event) {
    //     event.preventDefault()
    //     history.push('/week')
    // }
    // function handleDay(event) {
    //     event.preventDefault()
    //     history.push('/day')
    // }

    function handleEvent(event) {
        event.preventDefault()
        setView('event')
        console.log(event.target.dataset.day)
    }

    function handleBack() {
        setView('calendar')
    }

    function handleGoToNextMonth(event) {
        event.preventDefault()
        setCurrentDate(moment(currentDate).add(1, 'months'))
    }
    function handleGoToPreviousMonth(event) {
        event.preventDefault()

        setCurrentDate(moment(currentDate).subtract(1, 'months'))
    }

    // renders
    const header = () => {
        return (
            <>
                <div class="month__header">
                    <i class="fas fa-caret-left" onClick={handleGoToPreviousMonth}></i>
                    <h1 class="month__title"> {moment(currentDate).format("MMMM")} </h1>
                    <i class="fas fa-caret-right" onClick={handleGoToNextMonth}></i>
                </div>
                <p class="month__year">{moment(currentDate).format("YYYY")}</p>
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
                    days.push(
                        <a onClick={handleEvent} data-day={eventDate} class="calendar__day day">
                            {formattedDate}
                        </a>
                    )
                    first = first.add(1, 'days')
                }
            }
        }

        while (first <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = first.format('D')
                eventDate = first.format('L')
                days.push(
                    <a onClick={handleEvent} data-day={eventDate} class="calendar__day day">
                        {formattedDate}
                    </a>
                )
                first = first.add(1, 'days')
            }
            rows.push(<div class="calendar__week"> {days} </div>)
            days = []
        }
        return <div>{rows}</div>
    }


    // FORM
    function handleSubmit(event) {
        event.preventDefault()

        const { target: { validFromDate: { value: validFromDate }, validFromTime: { value: validFromTime }, longitude: { value: longitude }, latitude: { value: latitude }, alias: { value: alias }, email: { value: email } } } = event

        handleRegisterKey(validFromDate, validFromTime, longitude, latitude, alias, email)
    }

    const handleRegisterKey = async (validFromDate, validFromTime, longitude, latitude, alias, email) => {
        try {
            const { message, key: { id, token } } = await logic.retrieveKey(validFromDate, validFromTime, longitude, latitude, alias, email)

            history.push('/deployments')
        } catch ({ message }) {
            console.error(message)
        }
    }

    return <section className="register-key">
        <h2>register key</h2>
        <section className="calendar">
            <div className="calendar__grid">
                <div className="calendar__header">{header()}</div>
                <div>{week()}{days()}</div>
            </div>
        </section>
        <section>
            <form onSubmit={handleSubmit}>
                <label>
                    valid From:
                <input type="date" name="validFromDate" placeholder="valid" />
                    <input type="time" name="validFromTime" placeholder="valid" />
                </label>
                <label>
                    location:
                <input type="text" name="longitude" placeholder="longitude" />
                    <input type="text" name="latitude" placeholder="latitude" />
                </label>
                <label>
                    guest:
                <input type="text" name="alias" placeholder="name" />
                    <input type="email" name="email" placeholder="email" />
                </label>
                <button>> save</button>
            </form>
            <a href="#" onClick={event => {
                event.preventDefault()

                handleBack()
            }}>Go back</a>
        </section>
    </section>
})