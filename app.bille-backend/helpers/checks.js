const Shift = require('../models/shift')
const LaBilleShow = require('../models/laBilleShow')
const ShiftAsUser = require('../models/shiftAsUser')
const { Op } = require('sequelize')
const ExtraTime = require('../models/extraTime')

async function checkIfShiftIsFull(idShift){
    const shift = await Shift.findOne({where: { idShift: idShift }})
    const allUsersOfShift = await ShiftAsUser.findAll({where: {idShift: shift.idShift}})
    if(allUsersOfShift.length >= shift.maxUsers){
        return true
    }
    ////////console.log("checkIfShiftIsFull :false")
    return false
}

async function checkIfUserSubscribedToThisShift(idUser, idShift){
    ////////console.log("checkIfUserSubscribedToThisShift : ", idUser, ", ", idShift)
    try{
        const usersLooked = await ShiftAsUser.findOne({ where : {
            [Op.and]: [
                { idUser: idUser },
                { idShift: idShift }
            ],
        }})
        return usersLooked ? true : null
    }catch(error){
        //////console.log(error)
        return null
    }
}
async function checkIdUserAlreadySubsribedToGivenOpeningOrClosure(idShow, idUser, type){
    try{
        //console.log("checkIdUserAlreadySubsribedToGivenOpeningOrClosure")
        const checkIfRecordExist = await ExtraTime.findOne({
            where: {
                [Op.and]: [
                    {fkUser: idUser},
                    {fkLaBilleShow: idShow},
                    {type: type}
                ]
            }
        })
        //console.log("checkIfRecordExist : ", checkIfRecordExist.dataValues)
        if(!checkIfRecordExist.dataValues) throw new Error()
        else return true
    }catch(error){
        //console.log("error")
        return false
    }
}
module.exports = {
    checkIfShiftIsFull,
    checkIfUserSubscribedToThisShift,
    checkIdUserAlreadySubsribedToGivenOpeningOrClosure
}