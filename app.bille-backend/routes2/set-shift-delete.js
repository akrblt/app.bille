const Shift = require('../models/shift')

module.exports = (app) => {
    app.post('/api/deleteShift', async (req, res) => {
        try{
            console.log("delete shift : ", req.body)
            const idShift = req.body.idShift
            const shiftToDelete = await getShift(idShift)
            
            console.log("shiftToDelete :: ", shiftToDelete)
            const deleteAction = await shiftToDelete.destroy()
            if(!deleteAction) throw new Error()
            return res.status(200).send({status: 'success'})
        }catch(error){
            return res.status(500).send({status: 'error'})
        }
    })
}
const getShift = async (givenIdShift) => {
    const concernedShift = await Shift.findOne({where: { idShift: givenIdShift}})
    if(!concernedShift) throw new Error()
    else return concernedShift
}