const { getConcernedShift, getShiftSubscribtion } = require('../helpers/getters')
module.exports = (app) => {
    app.post('/api/removeUserFromShift', async function (req, res) {
        ////console.log("removeUserFromShift : ", req.body)
        const idShiftConcerned =req.body.idShift
        const idUserConcerned = req.body.idUser
        const concernedShift = await getConcernedShift(idShiftConcerned)
        //////console.log("concernedSHift : ", concernedShift)
        const usersOfShift = concernedShift.shiftUsers
        //////console.log("usersOfShift : ", usersOfShift)
        const userAlreadyPresent =  usersOfShift ? usersOfShift.filter(user => user.idUser === idUserConcerned) : null
        if(!userAlreadyPresent){
            return res.status(500).send({msg:'userNotPresent'})
        }
        //////console.log("userAlreadyPresent : ", userAlreadyPresent)
        const shiftSubscribtionToDestroy = await getShiftSubscribtion(idUserConcerned, idShiftConcerned)
        const action = shiftSubscribtionToDestroy ? shiftSubscribtionToDestroy.destroy() : null
        return action ? res.status(200).send({msg: 'success'}) : res.status(500).send({msg: 'error'})
    })
}