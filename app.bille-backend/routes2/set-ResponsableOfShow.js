

const { getShowById, getPreviousStatusOfShow } = require('../helpers/getters')

module.exports = (app) => {
    app.post('/api/setResponsableOfShow', async (req, res) => {  
        try{
            const recievedIdShow = req.body.idShow
            const recievedResponsableUser = req.body.responsableUser
            const responsableUser = await getUserById(recievedResponsableUser)
            if(!recievedIdShow || !responsableUser) throw new Error({status: 400, msg: 'bad data recieved'})
            const concernedShow = await getShowById(recievedIdShow) 
            concernedShow.showResponsable = recievedResponsableUser
            await concernedShow.save()
            return res.status(200).send({msg: 'success', newResponsable: responsableUser})
        }catch(err){
            if(!err.status) err.status = 500
            return res.status(err.status).send({state: 'Error', error: err.msg})
        }
    })
}