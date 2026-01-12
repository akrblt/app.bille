const { getUserByIdForUpdate } = require("../helpers/getters")

module.exports = (app) => {
    app.post('/api/resetUser', async function (req, res){
        try{
            const idUser = req.body.idUser
            //console.log("reset : ", idUser)
            if(!idUser) throw { status: 400, msg: 'bad_data' }
            const concernedUser = await getUserByIdForUpdate(idUser)
            //console.log("user : ", concernedUser)
            if (!concernedUser) throw { status: 404, msg: "no_user_found" };
            const rdnPassword = generateRandomPassword()
            concernedUser.set({
                isAlreadyConnected: 0,
                passwordConnexion: rdnPassword,
                password: null
            })
            await concernedUser.save()
            return res.status(200).send({ msg: "success" })
        }catch(error){     
            //console.log("e::", error)
            return res.status(error.status || 500).send({msg: error.msg || 'fail'})
        }
    })
}
const generateRandomPassword = (length = 12) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password
}