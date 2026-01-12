const { setShiftToShow } = require('../helpers/setters')
const { getAllShiftsForUpate, getShiftById } = require('../helpers/getters')

module.exports = (app) => {
    app.post('/api/updateShowShifts', async (req, res) => {  
        // formatage des données :
        // recievedShifts => Données doivent être tel quel dans la db, recues dans la req
        // previousShifts => Données enregistrées avant cette req pour update comparaison 
        const recievedShifts = req.body
        const idShow = req.body[0].idShow
        //console.log("updateShowShifts : ", recievedShifts)
        //console.log("ID :: ", idShow)
        const previousShiftsData = await getAllShiftsForUpate(idShow)
        const previousShifts = previousShiftsData ? {
            bar: previousShiftsData.filter(shift => shift.type === 'bar'),
            entree: previousShiftsData.filter(shift => shift.type === 'entree'),
            parking: previousShiftsData.filter(shift => shift.type === 'parking'),
            reunion: previousShiftsData.filter(shift => shift.type === 'reunion')
        } : null
        //console.log("previousShifts : ", previousShifts)
        // -------------------------- DELETE des shifts à supprimer ----------------------------------------
        if(previousShiftsData){
            try{
                const shiftsToDelete = getShiftsNotPresentInRecievedData(recievedShifts, previousShifts)
                for (const shift of shiftsToDelete) {
                    const shiftToDelete = await getShiftById(shift.idShift);
                    if (shiftToDelete.shift) {
                        await shiftToDelete.shift.destroy() // destruction du shift
                        if(shiftToDelete.shiftAsUser.length > 0){
                            for (const user of shiftToDelete.shiftAsUser){
                                await user.destroy() // destruction du userAsShift 
                            }
                        }
                    }
                }
            }catch(error){
                //////console.log(error)            
                return res.status(500).send({msg: `error`})
            }
            // -------------------------- UPDATE des infos (startTime, endTime, maxUsers) des shifts dejà existants ----------------------------------------
            try{
                for(const newShift of getRecievedShiftsWithId(recievedShifts)){
                    const previousShiftToUpdate = (await getShiftById(newShift.idShift)).shift
                    //////console.log("startTime !== startTime : ", newShift.startTime !== previousShiftToUpdate.startTime)
                    //////console.log("endTime !== endTime : ", newShift.endTime !== previousShiftToUpdate.endTime)
                    //////console.log("maxUsers !== maxUsers : ", newShift.maxUsers !== previousShiftToUpdate.maxUsers)
                    previousShiftToUpdate.startTime = newShift.startTime !== previousShiftToUpdate.startTime ? newShift.startTime : previousShiftToUpdate.startTime
                    previousShiftToUpdate.endTime = newShift.endTime !== previousShiftToUpdate.endTime ? newShift.endTime : previousShiftToUpdate.endTime
                    previousShiftToUpdate.maxUsers = newShift.maxUsers !== previousShiftToUpdate.maxUsers ? newShift.maxUsers : previousShiftToUpdate.maxUsers
                    await previousShiftToUpdate.save()
                }
            }catch(error){
                //////console.log(error)            
                return res.status(500).send({msg: `error`})
            }
        }
        // -------------------------- CREATE des shifts à Ajouter ----------------------------------------
        try{
            const recievedShiftsWithoutId = getRecievedShiftsWithoutId(recievedShifts)
            //////console.log("SHIFT A AJOUTER : ", recievedShiftsWithoutId)
            if(recievedShiftsWithoutId){
                await setShiftToShow(recievedShiftsWithoutId, recievedShifts.idShow) 
            }
            return res.status(200).send({msg: `success`})
        }catch(error){
            //////console.log(error)            
            return res.status(500).send({msg: `error`})
        }
        
    })
}

// ----------------------------------------------------- fonctions ------------------------------
function getRecievedShiftsWithId(recievedShifts){
    return [
        ...recievedShifts.bar.filter(shift => shift.idShift),
        ...recievedShifts.entree.filter(shift => shift.idShift),
        ...recievedShifts.parking.filter(shift => shift.idShift),
    ]
}
function getRecievedShiftsWithoutId(recievedShifts){
    return [
        ...recievedShifts.bar.filter(shift => !shift.idShift),
        ...recievedShifts.entree.filter(shift => !shift.idShift),
        ...recievedShifts.parking.filter(shift => !shift.idShift),
    ]
}
function formatShifts(shiftArray){
    return [
        ...shiftArray.bar,
        ...shiftArray.entree,
        ...shiftArray.parking,
    ]
}
function getShiftsNotPresentInRecievedData(recievedShifts, previousShifts){
    let dataToReturn = []
    const recievedShiftsWithId = [ // formatage données
        ...recievedShifts.bar.filter(shift => shift.idShift),
        ...recievedShifts.entree.filter(shift => shift.idShift),
        ...recievedShifts.parking.filter(shift => shift.idShift),
    ]
    const previousShiftsGiven = formatShifts(previousShifts)
    // parcours des previousShift et si il n'est pas dans recievedShift => return
    previousShiftsGiven.forEach(previousShift => {
        const isShiftPresent = recievedShiftsWithId.find(recievedShift => recievedShift.idShift === previousShift.idShift)
        if(!isShiftPresent){
            dataToReturn.push(previousShift)
        } 
    })
    return dataToReturn
}