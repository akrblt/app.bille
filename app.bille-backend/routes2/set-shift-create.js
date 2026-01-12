const Shift = require('../models/shift')

module.exports = (app) => {
    app.post('/api/createShift', async (req, res) => {
        try{
            //console.log("create shift : ", req.body)
            const recievedData = req.body
            const insert = await createShift(recievedData)  
            return res.status(200).send({status: "success", data: insert})
        } catch(error){
            return res.status(500).send({status: "error"})
        }  
    })
  }

const createShift = async (recievedData) => {
    const newShift = await Shift.create({
        fkLaBilleShow: recievedData.fkShow,
        type: recievedData.type,
        maxUsers: recievedData.maxUsers,
        startTime: recievedData.startTime,
        endTime: recievedData.endTime,
        indexForType: recievedData.indexForType
    })
    //console.log("newShift : ", newShift)
    if(!newShift) throw new Error()
    else return newShift.dataValues
}