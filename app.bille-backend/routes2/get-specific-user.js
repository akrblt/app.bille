const { getUserById } = require('../helpers/getters')

module.exports = (app) => {
    app.get('/api/getSpecifiedUser', async function (req, res){
        try{
            ////console.log("getSpecifiedUser")
            const idUser = req.query.idUser
            ////console.log("idUser : ", idUser)
            if(!idUser) throw new Error()
            const user = await getUserById(idUser)
            ////console.log("user : ", user)
            if(!user) throw new Error()
            return res.status(200).send({success: true, user: user})
        }catch(e){
            ////console.log("e : ", e)
            return res.status(400).send({success: false, user: null})
        }
    })
}