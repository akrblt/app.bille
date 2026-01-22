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

/*

Correction du bug du calendrier

Le bug apparaissait lorsqu’un utilisateur cliquait sur une date du calendrier,
 fermait le panneau de détails, puis cliquait à nouveau sur la même date. 
 Dans ce cas, le panneau de détails ne se rouvrait pas.

La cause du problème était liée au fonctionnement de React :
 lorsque l’état reçoit la même valeur, React ne considère pas qu’il y a un changement et ne relance donc pas le useEffect. 
 Ainsi, lors du second clic sur la même date, la valeur de selectedDate restait identique et la navigation vers la page de détails n’était pas déclenchée.

Pour corriger ce bug, nous avons réinitialisé temporairement l’état selectedDate à null, puis nous l’avons redéfini avec la valeur sélectionnée. 
Cela force React à détecter un changement d’état et à relancer correctement l’effet, 
ce qui permet d’ouvrir à nouveau le panneau de détails sans rechargement de la page, conformément aux bonnes pratiques React.




*/