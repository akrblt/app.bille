const { setUserToExtraTimeOfShow } = require('../helpers/setters')
const { checkIdUserAlreadySubsribedToGivenOpeningOrClosure } = require('../helpers/checks')

module.exports = (app) => {
    app.post('/api/subscribeUserToExtraTime', async (req, res) => {  
        try{
            const idUser = req.body.idUser
            const type = req.body.type
            const idShow = req.body.fkShow
            console.log("body : ", req.body)
            if(!idUser || !type || !idShow) return res.status(400).send({msg: 'error1'})
            const userAlreadySubsribed = await checkIdUserAlreadySubsribedToGivenOpeningOrClosure(idShow, idUser, type)
            if(userAlreadySubsribed) return res.status(400).send({msg: 'error2'})
            //console.log("userAlreadySubsribed : ", userAlreadySubsribed)
            const subscribtion = await setUserToExtraTimeOfShow(idShow, idUser, type)
            if(subscribtion !== 'success') throw new Error()
            return res.status(200).send({msg: 'success'})
        }catch(error){
            //console.log(error)
            return res.status(error.status || 500).send({msg: 'fail'})
        }
    })
}