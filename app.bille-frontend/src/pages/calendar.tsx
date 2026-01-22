import React, { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom'
import CalendarMonthPicker from '../components/calendar/calendar-picker/calendar-month-picker';
import UserConnexion from '../helpers/user-connexion';
import './css/calendar.css'

const Calendar: FunctionComponent = () => {
    const [selectedDate, setSelectedDate] = useState<number | null>(null)
    const naviguate = useNavigate()

    useEffect(() => {
        //console.log(UserConnexion.iAmConnected());
        //console.log(UserConnexion.getUserData());

        if(UserConnexion.iAmConnected() === false) naviguate(`/login`)
        if(selectedDate != null) naviguate(`/calendar/details/${selectedDate}`)
    }, [selectedDate])

    // bug ici 
   // const handleChangeSelectedDate = (newValue: number): void => {
    //    setSelectedDate(newValue)
  //  }

    const handleChangeSelectedDate = (newValue: number): void => {
    setSelectedDate(null)
    setTimeout(() => {
        setSelectedDate(newValue)
    }, 0)
}

    return(
            <div id='calendar-open'>     
                <CalendarMonthPicker handleChangeSelectedDate={handleChangeSelectedDate} source='calendar'/>
                <Outlet />
            </div>
    )
}

// console.log(UserConnexion.iAmConnected());
export default Calendar