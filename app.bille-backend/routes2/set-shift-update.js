const Shift = require('../models/shift')

module.exports = (app) => {
    app.post('/api/updateShift', async (req, res) => {
        try{            
            //console.log("update Shift : ", req.body)
            const recievedData = req.body
            const shiftToUpdate = await getShift(recievedData.idShift)
                shiftToUpdate.type = recievedData.type || 'normal'
                shiftToUpdate.maxUsers = recievedData.maxUsers
                shiftToUpdate.startTime = recievedData.startTime
                shiftToUpdate.endTime = recievedData.endTime
                shiftToUpdate.indexForType = recievedData.indexForType
                await shiftToUpdate.save()
            return res.status(200).send({status: "success"})
        } catch(error){
            //console.log("error :: ", error)
            return res.status(500).send({status: "error"})
        }  
    })
}
const getShift = async (givenIdShift) => {
    const concernedShift = await Shift.findOne({where: { idShift: givenIdShift}})
    if(!concernedShift) throw new Error()
    else return concernedShift
}
