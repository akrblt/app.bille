const ShiftAsUser = require('../models/shiftAsUser')
const { getConcernedShift, getUserById } = require('../helpers/getters')
// endpoint de création d'une nouvelle soirée
// supprime toutes les données liée à la date
module.exports = (app) => {
    app.post('/api/subscribeUserToShift', async (req, res) => {  
        const idShiftConcerned =req.body.idShift
        const idUserConcerned = req.body.idUser
        const typeConcerned = 'normal'
        const concernedShift = await getConcernedShift(idShiftConcerned)
        const userAlreadyPresent = concernedShift.shiftUsers.filter(user => user.idUser === idUserConcerned) 
        if(userAlreadyPresent && userAlreadyPresent.length > 0){
            //////console.log("user deja inscrit ! ")
            return res.status(500).send({msg:'fail'})
        }
        //check if shift isFull
        if(concernedShift.shiftUsers && concernedShift.maxUsers <= concernedShift.shiftUsers.length){
            //////console.log("shift plein")
            return res.status(500).send({msg: 'fail'})
        }
        const insertionOfUser = await insertUserInShift(idUserConcerned, idShiftConcerned, typeConcerned)
        if(!insertionOfUser) return res.status(500).send({msg: 'unknown_error'})
        const login = await getUserById(idUserConcerned)
        //console.log("log : ", login)
        const dataToReturn = {
            idSubscribe: insertionOfUser.dataValues.idShiftAsUser,
            idUser: insertionOfUser.dataValues.idUser,
            username: login
        }
        ////console.log(dataToReturn)
        return res.status(200).send({msg: 'success', data: dataToReturn}) 
    })
}

async function insertUserInShift(idUser, idShift, type){
    try{
        const insertion = await ShiftAsUser.create({
            idUser: idUser,
            idShift: idShift,
            type: type
        })
        return insertion || null
    }catch(error){
        return null
    }
}