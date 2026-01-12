const { getUserByIdForUpdate } = require("../helpers/getters")

module.exports = (app) => {
    app.post('/api/updateUser', async function (req, res){
        try{
            const givenDataUser = req.body
            //console.log("update user ::: ", givenDataUser)
            if(!givenDataUser.idUser) throw { status: 400, msg: 'Utilisateur introuvable' }
            const concernedUser = await getUserByIdForUpdate(givenDataUser.idUser)
            //console.log("concernedUser :: ", concernedUser)
            if (!concernedUser) throw { status: 404, msg: "Utilisateur introuvable" };
            concernedUser.set({
                firstname: givenDataUser.firstname || concernedUser.firstname,
                login: givenDataUser.login || concernedUser.login,
                adminLevel: givenDataUser.adminLevel || concernedUser.adminLevel,
            })
            await concernedUser.save()
            return res.status(200).send({ msg: "success" })
        }catch(error){
            return res.status(error.status || 500).send({msg: error.msg || 'fail'})
        }
    })
}