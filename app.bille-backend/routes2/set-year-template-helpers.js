const LaBilleShow = require('../models/laBilleShow')
const Shift = require('../models/shift')
const { Op, Sequelize } = require('sequelize');
const { eachDayOfInterval } = require('date-fns')

// check if yearTemplate is already set (data recorded for specified year)
// return true if already set else return false
async function checkExistingTemplate(year){
    try{
        const check = await LaBilleShow.findAll({
            where: Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('laBilleShow.date')), year)
        })
        return (check.length > 0) ? true : false
    }catch(error){
        //////console.log("error try : ", error)
    }
}

async function setShowAndShifts(show, shifts){
    try{
        // insertion du show
        const newShow = await LaBilleShow.create({
            date: show.date,
            status: show.status,
            notes: null,
            soundEngineer: null,
            showResponsable: null
        })
        if(show.status !== 'ferme' && shifts.length > 0) {
            for await (const shift of shifts){
                await Shift.create({
                    fkLaBilleShow: newShow.laBilleShowId,
                    type: shift.type,
                    maxUsers: shift.maxUsers,
                    startTime: shift.startTime,
                    endTime: shift.endTime,
                    indexForType: shift.indexForType
                })
            }
        }
        return true
    }catch(error){
        ////////console.log("show : ", show)
        ////////console.log("err : ", error)
        return null
    }
} 
// return all the Date() of the specified year
async function getAllDatesYear(year){
    if(!year) return null
    const startDate = new Date(`${year}-01-01`)
    const endDate = new Date(`${year}-12-31`)
    const allDates = (startDate && endDate) ? eachDayOfInterval({ start: startDate, end: endDate }) : null
    //////console.log(allDates)
    return allDates
}
// return name of day of date (monday tuesday etc)
function getDayName(date){
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date).toLowerCase();
}
// take Date() as param
// return date formated 'YYYY-mm-dd'
function getFormatedDate(date){
    const year = date.getFullYear()
    const month = parseInt(date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`
    const day = parseInt(date.getDate()) < 10 ? `0${date.getDate()}` : `${date.getDate()}`
    const result = `${year}-${month}-${day}`
    //////console.log("result : ", result)
    return result
}
// determine if a date is the last tuesday of the month (true if is and else false)  
function isLastTuesdayofMonth(date) {
        const dateRef = new Date(date)
        const lastDayOfMonth = new Date(dateRef.getFullYear(), dateRef.getMonth() + 1, 0) // dernier jour du mois
        const lastTuesday = lastDayOfMonth.getDate() - ((lastDayOfMonth.getDay() + 5) % 7); // Calcule le dernier mardi
        return dateRef.getDate() === lastTuesday;
}
// -----------------------------------------------------------------------------------------------
// ------------------------------- Templates shows -----------------------------------------------
// -----------------------------------------------------------------------------------------------
// take as param : 
// 1) the name of day ("monday" etc) 
// 2) weekTemplate (weekTemplateToRecord => prog-planification-form.tsx)
// 3) date formated 'YYYY-mm-dd'
// return the template approriate according to given template of week
async function setDayTemplate(template, dayName, date){
    const templateStatus = template.find((day) => day.name === dayName) 
    if(isLastTuesdayofMonth(date)) return reunionTemplate(date)
    else if(templateStatus.value && templateStatus.value === 'closed') return fermeTemplate(date)
    else if (templateStatus.value && templateStatus.value === 'open') return normalTemplate(date)
}
function normalTemplate(date){
    // {show, shifts}
    return {
        show: {
            date: date,
            status: 'normale',
            notes: null,
            soundEngineer: null,
            showResponsable: null,
        },
        shifts: [
            {
                fkLaBilleShow: null,
                type: 'bar',
                maxUsers: 2,
                startTime: '20:00',
                endTime: '22:00',
                indexForType: 0
            },
            {
                fkLaBilleShow: null,
                type: 'bar',
                maxUsers: 2,
                startTime: '22:00',
                endTime: '00:00',
                indexForType: 1
            },
        ]
    }
}
function reunionTemplate(date){
    return {
        show: {
            date: date,
            status: 'reunion',
            notes: null,
            soundEngineer: null,
            showResponsable: null,
        },
        shifts: [
            {
                fkLaBilleShow: null,
                type: 'reunion',
                maxUsers: 1000,
                startTime: '19:00',
                endTime: '22:00',
                indexForType: 0
            }
        ]
    }
}
function fermeTemplate(date){
    return {
        show: {
            date: date,
            status: 'ferme',
            notes: null,
            soundEngineer: null,
            showResponsable: null,
        },
        shifts: []
    }
}

module.exports = {
    checkExistingTemplate,
    getAllDatesYear,
    getDayName,
    setDayTemplate,
    getFormatedDate,
    setShowAndShifts
}