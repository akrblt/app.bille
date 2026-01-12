const { getUserByIdForUpdate } = require('../helpers/getters')

module.exports = (app) => {
    app.post('/api/deleteUser', async function (req, res){
        try{
            const givenDataUser = req.body
            //console.log("deleteUser : ", givenDataUser)
            if(!givenDataUser.idUser) throw { status: 400, msg: 'Utilisateur introuvable' }
            const concernedUser = await getUserByIdForUpdate(givenDataUser.idUser)
            if (!concernedUser) throw { status: 404, msg: "Utilisateur introuvable" };
            concernedUser.status = 0
            await concernedUser.save()
            return res.status(200).send({msg: "utilisateurs désactivé avec succès"})
        }catch(error){
            //console.log("error :", error)
            return res.status(error.status || 500).send({msg: error.msg || 'Oups! Il y a eu un soucis'})
        }
    })
}