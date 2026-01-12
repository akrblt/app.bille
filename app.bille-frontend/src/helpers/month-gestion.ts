import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, parseISO } from 'date-fns';
import {SelectedMonth} from '../components/calendar/calendar-picker/calendar-month-picker'
import { fr } from 'date-fns/locale';

const monthName = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
]; 
export default class MonthGestion {
    //take a date as param and return number {monthNumber: 1, yearNumber: 2025, monthLabel: 'janvier 2025'}
    static getMonthInfoFromDate = (date: Date = new Date()): SelectedMonth  => {
        const monthNumber = date.getMonth() + 1; 
        const monthLabel = `${monthName[monthNumber - 1]}`;
        return {
            monthNumber: date.getMonth() + 1,
            yearNumber: date.getFullYear(),
            monthLabel: monthLabel
        }  
    } 

    // return all dates of the weeks from the month and year specified
    static getCalendarWeeksFromMonthNumber = (month: number, year: number): string[][] => {
        console.log(month, ", ", year)
        const firstDayOfMonth = startOfMonth(new Date(year, month - 1)); // Le mois commence à 0 (janvier = 0)
        const lastDayOfMonth = endOfMonth(new Date(year, month - 1));  
        const firstDayOfCalendar = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 }); // Lundi
        const lastDayOfCalendar = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });  
        const days = eachDayOfInterval({ start: firstDayOfCalendar, end: lastDayOfCalendar });  
        const weeks: Date[][] = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }
        console.log("weeks", weeks)
        return weeks.map(week => week.map(day => format(day, 'yyyy-MM-dd'))); // Retourne des dates formatées
    };
    static getDaysInMonth(year: number, month: number) {
        // month = 1 (janvier) → 12 (décembre)
        // JavaScript attend 0–11 pour les mois, donc on fait month - 1
        const date = new Date(year, month, 0); // "0" = dernier jour du mois précédent
        const daysCount = date.getDate(); // nombre de jours dans le mois

        // Générer un tableau [1, 2, ..., daysCount]
        return Array.from({ length: daysCount }, (_, i) => i + 1);
    }
    static isDateToday = (date: Date) => {
        return new Date() === date
    } 
    // return label "7 janvier 2019" from a given Date()
    static getCompletDateLabel = (givenDate: Date) => {
        //////console.log("givenDate : ", givenDate)
        const date = givenDate.toISOString().split("T")[0] 
        const dateYYYYmmDD = parseISO(date);
        const day = format(dateYYYYmmDD, 'EEEE', { locale: fr });
        const dateDay = format(dateYYYYmmDD, 'd', { locale: fr });
        const dateMonth = format(dateYYYYmmDD, 'MMMM', { locale: fr });
        const dateYear = format(dateYYYYmmDD, 'yyyy', { locale: fr });
        //////console.log(`${day} ${dateDay} ${dateMonth} ${dateYear}`)
        return `${day} ${dateDay} ${dateMonth} ${dateYear}`  || null;
    } 
    static formatDateIso(isoString: any) {
        const date = new Date(isoString);
        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // +1 car getUTCMonth() commence à 0
        const year = date.getUTCFullYear();
        return `${day}-${month}-${year}`;
    }
} 