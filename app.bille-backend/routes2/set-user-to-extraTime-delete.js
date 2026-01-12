
const ExtraTime = require('../models/extraTime')

module.exports = (app) => {
    app.post('/api/deleteUserToExtraTime', async (req, res) => {  
        try{            
            const idExtraTime = req.body.idExtraTime
            console.log("delete : ", idExtraTime)
            if(!idExtraTime) throw { status: 400, msg: 'fail_no_user'}
            const extraTimeExist = await getExtraTime(idExtraTime)
            //console.log("extra ::", extraTimeExist)
            await extraTimeExist.destroy()
            return res.status(200).send({msg: "success"})
        }catch(error){
            //console.log("Erreur : ", error)
            return res.status(error.status || 500).send({msg: error.msg || 'fail'})
        }
    })
}

const getExtraTime = async (givenId) => {
    if(!givenId) throw { status: 500, msg: 'bad_data'} 
    const extraTimeFound = await ExtraTime.findOne({where: {idExtraTime: givenId}})
    if (!extraTimeFound) throw { status: 500, msg: 'fail_not_founded'}
    return extraTimeFound
}   