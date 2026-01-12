import React, { FunctionComponent, useEffect, useState } from 'react';
import MonthGestion from '../../../helpers/month-gestion';
import CalendarDatePicker from './calendar-date-picker';
import './calendar.css';
import RecapDetails from '../../recap/recap-details';

export type SelectedMonth = {
    monthNumber: number,
    yearNumber: number,
    monthLabel: string
}
type Props = {
    source: "calendar" | "recap", 
    handleChangeSelectedDate: (newVal: number) => void 
}

const CalendarMonthPicker: FunctionComponent<Props> = ({ handleChangeSelectedDate, source }) => {
    const [monthInfos, setMonthInfos] = useState<SelectedMonth>(MonthGestion.getMonthInfoFromDate(new Date()));

    // incrémentation positif ou négatif du mois séléctionné 
    const scrollMonth = (type: string): void => { 
        let newMonth: number = monthInfos.monthNumber;  
        let newYear: number = monthInfos.yearNumber; 
        switch (type) {
            case 'past': {
                if(monthInfos.monthNumber === 1){    
                    newMonth = 12;
                    newYear = monthInfos.yearNumber - 1;
                } 
                else newMonth--;
                break
            }
            case 'next': {   
                if(monthInfos.monthNumber === 12){
                    newMonth = 1;
                    newYear = monthInfos.yearNumber + 1; 
                }
                else newMonth++;   
                break
            }
        }    
        const newDate: SelectedMonth = MonthGestion.getMonthInfoFromDate(new Date(newYear, newMonth - 1));
        setMonthInfos(newDate);
    }
    return (  
        <div id='complete-calendar-container'>           
            <div id='calendarBtContainer'>
                <button  
                    className='calendar-month-bt'
                    onClick={() => { scrollMonth('past') }} 
                >{'<<'}</button>
                <input type='text' id='monthLabel' value={`${monthInfos.monthLabel} ${monthInfos.yearNumber}`} disabled />
                <button  
                    className='calendar-month-bt'         
                    onClick={() => { scrollMonth('next') }} 
                >{'>>'}</button>
            </div>
            { source === 'calendar' ? <CalendarDatePicker monthInfos={monthInfos} handleChangeSelectedDate= {handleChangeSelectedDate} /> : null }
        </div> 
    );
}
export default CalendarMonthPicker;