const { setShiftToShow } = require('../helpers/setters')
const Shift = require('../models/shift')
const ShiftAsUser = require('../models/shiftAsUser')

module.exports = (app) => {
    app.post('/api/updateShifts', async (req, res) => {  
        //console.log("updateShiftsInformations : ", req.body)
        const idShow = req.body.idShow
        const showStatus = req.body.showStatus
        const shifts = req.body.shifts
        try{
            if(!idShow || !showStatus) throw new Error()
            if(showStatus === 'ferme' || !shifts || shifts.length === 0) destroyAllShifts(idShow)
            const shiftsToInsert = shifts.filter((shift) => shift.idShift === null)
            //const shiftsToUpdate = shifts.filter((shift) => shift.idShift !== null)
            createShifts(shiftsToInsert)
        }catch(error){
            return res.status(error.status || 500).send({msg: error.msg || "fail"})
        }

    })
}
async function destroyAllShifts(idShow){
    throw { status: 200, msg: 'success_delete_all'}
}
async function createShifts(idShow, shiftArray){
    try{
        if(!shiftArray || idShow || shiftArray.length === 0) throw new Error()
        const newShiftInsertion = await Promise.all(shiftArray.map(async (shift) => {
            const createdShift = await Shift.create({
                fkLaBilleShow: idShow,
                type: shift.type,
                startTime: shift.startTime,
                endTime: shift.endTime,
                maxUsers: shift.maxUsers,
                indexForType: shift.indexForType
            })   
            if(shift.users.length > 0){
                await Promise.all(shift.users.map(async (user) => {
                    await ShiftAsUser.create({
                        idShift: createdShift.idShift,
                        idUser: user.idUser,
                        type: 'normal'
                    })
                }))
                
            }
        }))
        if(newShiftInsertion) return true
    }catch(error){
        //console.log(error)
        return false
    }
}
async function updateShift(){

}
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