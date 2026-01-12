const LaBilleShow = require('../models/laBilleShow')
const Shift = require('../models/shift')
const ShiftAsUser = require('../models/shiftAsUser')
const ExtraTime = require('../models/extraTime')
const { getAllShiftsAndUsersOfAshow, getUsersSubscribedToShift, getShowById, getShiftRelations } = require('../helpers/getters')
const { Op, Sequelize } = require('sequelize')

// insert new record for "show" table
// return the idShow of the rec
// in case of unicity error return ce result if one
async function setShow(data){
    try{
        const newShow = await LaBilleShow.create({
            soundEngineer: data.soundEngineer,
            showResponsable: data.showResponsable,
            status: data.status,
            date: data.date,
            notes: data.notes
        })  
        const dateToModify = newShow.dataValues.date
        var year = dateToModify.toLocaleString("default", { year: "numeric" })
        var month = dateToModify.toLocaleString("default", { month: "2-digit" })
        var day = dateToModify.toLocaleString("default", { day: "2-digit" })
        var formattedDate = year + "-" + month + "-" + day;
        //////console.log(formattedDate);
        newShow.dataValues.date = formattedDate
        return newShow ? newShow.dataValues : null
    }catch(error){
        //////console.log(error)
        if (error instanceof Sequelize.UniqueConstraintError) {
            const msg = 'unicity_error'
            return res.status(400).send(msg)
        }
        return null
    } 
}
async function findOrCreateShow(data){
    try{
        const [newShow, created] = await LaBilleShow.findOrCreate({
            where: {
                date: data.date, // Champ soumis à la contrainte d'unicité
            },
            defaults: {
                soundEngineer: data.soundEngineer,
                showResponsable: data.showResponsable,
                status: data.status,
                notes: data.notes
            }
        })
        if(!created){
            //////console.log("Enregistrement déjà existant : ", newShow);
            return newShow ? newShow.dataValues  : null //res.status(400).json({ message: 'unicity_error', existingRecord: newShow });
        }
        return newShow ? newShow.dataValues : null
    }catch(error){
        //////console.log(error)
        return null
    }
}
async function setShiftToShow(shiftArray, idShow){  
    try{
        if(shiftArray && idShow && shiftArray.length > 0){
            const newShiftInsertion = await Promise.all(shiftArray.map(async (shift) => {
                const newShift = await Shift.create({
                    fkLaBilleShow: idShow,
                    type: shift.type,
                    startTime: shift.startTime,
                    endTime: shift.endTime,
                    maxUsers: shift.maxUsers,
                    indexForType: shift.indexForType
                })   
                return newShift.dataValues
            }));
            newShiftInsertion.forEach(shift => {
                shift.startTime = shift.startTime.slice(0, 5)
                shift.endTime = shift.endTime.slice(0, 5)
            })
            return newShiftInsertion
        }
        return null
    }catch(error){
        //////console.log(error)
        return null
    }
}
// add a new user to shift
async function setUserToShift(idUser, idShift, type){
    try{
        const newUserInShift = await ShiftAsUser.create({
            idUser: idUser,
            idShift: idShift,
            type: type
        })
        return newUserInShift.dataValues
    }catch(error){
        //////console.log("erreur : ", error)
        return false
    }
}
async function destroyAllShiftsAndUsersOfAShow(idShow){
    //////console.log("idSHow : ", idShow)
    try{
        const concernedShifts = await getAllShiftsAndUsersOfAshow(idShow)
        ////console.log("concernedShifts : ", concernedShifts)
        if (!concernedShifts.length) {
            return '!concernedShifts.length'
        }   
        for (const shift of concernedShifts) {
            const usersSubscribed = await getShiftRelations(shift.idShift)
            if(usersSubscribed.length){            
                for(const user of usersSubscribed){
                    await user.destroy()
                }
            }
            await shift.destroy();
        }
        return 'ok'
    }catch(error){
        //////console.log("erreur : ", error)
        return null
    }
}

function returnBasicTemplate(idShow){
    return [
        {
            fkLaBilleShow: idShow,
            type: 'bar',
            maxUsers: 2,
            startTime: '20:00',
            endTime: '22:00',
            indexForType: 0
        },{
            fkLaBilleShow: idShow,
            type: 'bar',
            maxUsers: 2,
            startTime: '22:00',
            endTime: '00:00',
            indexForType: 1
        }
    ]
}
async function setBasicalShiftTemplateToShow(idShow){
    try{
        const shiftsTemplate = returnBasicTemplate(idShow)
        //////console.log("setBasicalShiftTemplateToShow")
        //////console.log("shiftsTemplate : ", shiftsTemplate)
        //////console.log("idShow : ", idShow)
        for (const shift of shiftsTemplate) {
            const data = await Shift.create({
                fkLaBilleShow: idShow,
                type: shift.type,
                maxUsers: shift.maxUsers,
                startTime: shift.startTime,
                endTime: shift.endTime,
                indexForType: shift.indexForType
            })
            //////console.log("data : ", data)
        }
    }catch(error){
        return null
    }
}

async function destroyAllShiftsNotBar(idShow){
    try{
        const shiftsNotBar = await Shift.findAll({
            where: {
                [Op.and]: [
                    {fkLaBilleShow: idShow},
                    {[Op.ne]: [{type: 'bar'}]}
                ]
            }
        })
        for (const shift of shiftsNotBar) {
            const usersSubscribed = await getUsersSubscribedToShift(shift.idShift)
            if(usersSubscribed.length){            
                for(const user of usersSubscribed){
                    await user.destroy()
                }
            }
            await shift.destroy();
        }
    }catch(error){

    }
}

/*
async function setNewShow(data){
    try{
        if(!checkIfShowExistByDate(data.date)){
            const newShow = await LaBilleShow.create({
                soundEngineer: data.soundEngineer,
                showResponsable: data.showResponsable,
                status: data.status,
                date: data.date,
                band: data.band
            })
            if(newShow){
                return newShow.dataValues
            }
            return null
        }
    }catch(error){
        //////console.log(error)
        return null
    }
}
async function setNewShiftsOfNewShow(shiftArray, idShow){
    try{
        const newShiftInsertion = await Promise.all(shiftArray.map(async (shift) => {
            const newShift = await Shift.create({
                fkLaBilleShow: idShow,
                type: shift.type,
                startTime: shift.startTime,
                endTime: shift.endTime,
                maxUsers: shift.maxUsers
            })
            if(shift.users && shift.users.length > 0){
                const idShift = newShift.idShift
                const usersInShift = await Promise.all(shift.users.map(async (user) => {
                    const newUserInShift = await ShiftAsUser.create({
                        idUser: user.id,
                        idShift: idShift,
                        type: user.type
                    })
                    return newUserInShift.dataValues
                }))
            }
            return newShift.dataValues
        }));
        return newShiftInsertion
    }catch(error){
        //////console.log(error)
        return null
    }
}
async function setNewUsersInShift(){

}*/
async function setUserToExtraTimeOfShow(idShow, idUser, type){
    try{
        const insertion = await ExtraTime.create({
            fkUser: idUser,
            fkLaBilleShow: idShow,
            type: type
        })
        return insertion ? 'success' : 'error3'
    }catch(error){
        return 'error2'
    }
}
module.exports = {
    setShow,
    setShiftToShow,
    setUserToShift,
    findOrCreateShow,
    destroyAllShiftsAndUsersOfAShow,
    setBasicalShiftTemplateToShow,
    destroyAllShiftsNotBar,
    setUserToExtraTimeOfShow
}