import React, { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom'
import CalendarMonthPicker from '../components/calendar/calendar-picker/calendar-month-picker';
import UserConnexion from '../helpers/user-connexion';
import './css/calendar.css'

const Calendar: FunctionComponent = () => {
    const [selectedDate, setSelectedDate] = useState<number | null>(null)
    const naviguate = useNavigate()

    useEffect(() => {
        if(UserConnexion.iAmConnected() === false) naviguate(`/login`)
        if(selectedDate != null) naviguate(`/calendar/details/${selectedDate}`)
    }, [selectedDate])

    const handleChangeSelectedDate = (newValue: number): void => {
        setSelectedDate(newValue)
    }
    return(
            <div id='calendar-open'>     
                <CalendarMonthPicker handleChangeSelectedDate={handleChangeSelectedDate} source='calendar'/>
                <Outlet />
            </div>
    )
}
export default Calendar