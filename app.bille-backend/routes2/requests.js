const { sequelize } = require('../db/sequelize');
const LaBilleShow = require('../models/laBilleShow')
const Shift = require('../models/shift')
const ShiftAsUser =require('../models/shiftAsUser')
const User = require('../models/user')
const ExtraTime = require('../models/extraTime')
const { Op, Sequelize } = require('sequelize');

// return id, date and status, isShiftFull of all shows between two dates
async function getstatusOfShowsOfMonth(startDate, endDate){
    const allShowsFromMonth = await LaBilleShow.findAll({
        where: {
            [Op.and]: [
                { date: { [Op.gte]: startDate } },
                { date: { [Op.lte]: endDate } }  
            ]
        },
        include: [{
            model: Shift,
            as: 'shifts',
            required: false,
            include: [{
                model: User,
                as: 'shiftUsers',
                required: false,
                through: {
                    model: ShiftAsUser,
                    attributes: [] // pour ne pas inclure les attributs de la table pivot
                }
            }],
        },{
            model: User,
            as: 'openingClosures',
            required: false,
            through: {
                model: ExtraTime,
                attributes: ['fkUser']
            }
        }],
        attributes: ['laBilleShowId', 'date', 'status', 'notes'],
    });
    if(!allShowsFromMonth) return null
    let dataToReturn = []
    for await (show of allShowsFromMonth){
        dataToReturn.push({
            laBilleShowId: show.laBilleShowId,
            date: show.date,
            status: show.status,
            isShowFull: checkIfShowIsComplete(show.dataValues),
            notes: show.notes
        }) 
    }
    return dataToReturn
}

//this check if all shifts of a show have all necessary beneveols for each shift (shift.maxUsers)
// return false if remain some benevol to subscribe, true if all shifts are completes
const checkIfShowIsComplete = (show) => {
    if(show.status === 'reunion' || show.status === 'ferme') return true
    //if(!show.openingClosures || show.openingClosures.length === 0) return false // si personne inscrit a Extratime
    const unFullShifts = show.shifts.find(shift => { 
        return shift.shiftUsers.length < shift.maxUsers
    })
    return !unFullShifts 
}

module.exports = {
    getstatusOfShowsOfMonth
}