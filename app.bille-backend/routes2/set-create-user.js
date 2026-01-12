const User = require('../models/user')
const { UniqueConstraintError } = require('sequelize');

module.exports = (app) => {
    app.post('/api/createUser', async function (req, res){
        try{
            const dataRecieved = req.body   
            //console.log("dataRecieved : ", dataRecieved)
            const randomPassword = generateRandomPassword()
            const formatedData = validatedAndFormatedData(dataRecieved, randomPassword)
            const loginDispo = await loginAvailable(formatedData.login)
            if(!loginDispo) throw {status: 400, message: "⛔ Login dejà pris ⛔"}
            const insertedUser = await insertNewUser(formatedData)
            return res.status(200).send({msg: 'Utilisateur créé avec succès', data: insertedUser})
        }catch(err){
            //console.log("erreur creation user ::: ", err)
            return res.status(err.status || 500).send({msg : err.message || "Oups! Il y a eu un soucis."})
        }
    })
}

const validatedAndFormatedData = (userData, randomPassword) => {
    if(!userData.login || typeof userData.login !== 'string') throw { message: 'Données incorrects', status: 400 }   
    if(!userData.adminLevel || typeof userData.adminLevel !== 'number') throw { message: 'Données incorrects', status: 400 }
    if(!userData.firstname || typeof userData.firstname !== 'string') throw { message: 'Données incorrects', status: 400 }  
    return {
        login: userData.login,
        firstname: userData.firstname,
        adminLevel: userData.adminLevel,
        passwordConnexion: randomPassword,
        isAlreadyConnected: false
    }
}

const generateRandomPassword = (length = 12) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password
}
const insertNewUser = async (givenData) => {
    //console.log(givenData)
    try{
        const insertion = await User.create({
            login: givenData.login,
            firstname: givenData.firstname,
            adminLevel: givenData.adminLevel,
            passwordConnexion: givenData.passwordConnexion,
            isAlreadyConnected: givenData.isAlreadyConnected,
            status: true
        })
        return insertion.dataValues
    }catch(error){
        //console.log("erreur insertion : ", error)
        throw {status: 500, message: "Oups ! Quelque chose s'est mal passé"}
    }   
}
const loginAvailable = async (givenLogin) => {
    const user = await User.findOne({where: {login: givenLogin, status: true}})
    return user ? false : true
}