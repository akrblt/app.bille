const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/user')

// ce endpoint attend 2 parametres : login & password
module.exports = (app) => {
    app.post('/api/login', async (req, res) => {
        const login = req.body.login
        const password = req.body.password
        ////console.log("body : ", req.body)
        try{
            // requete qui va chercher l'utilisateur (son login)
            let userData = await getActivUserByLogin(login, password)
            ////console.log("userData : ", userData)
            const isPasswordValid = await bcrypt.compare(password, userData.password)
            if(!isPasswordValid) throw { status: 400, msg: "bad_user_data_p" } 
            const dataOfUserFormated = {
                idUser: userData.idUser,
                login: userData.login,
                adminLevel: userData.adminLevel
            }
            const accessToken = jwt.sign(userData.toJSON(), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' })
            const refreshToken = jwt.sign(userData.toJSON(), process.env.REFRESH_TOKEN_SECRET, { expiresIn: '24h' })
            return res.status(200).send({status: "success_login", msg: "success_login", data: dataOfUserFormated, token: accessToken, refresh: refreshToken})
        }catch(error){
            console.error(error)
            return res.status(error.status || 500).send({ status: "fail", msg: error.msg || 'strange_error' })
        }
    })
}
async function getActivUserByLogin(givenLogin, givenPassword){
    const userFound = await User.findOne({ where: {login: givenLogin }})
    ////console.log("userfound : ", userFound)
    //console.log("password : ", givenPassword)
    //console.log("passwordRef : ", userFound.passwordConnexion)
    if(!userFound) throw { msg: "bad_user_data_l", status: 400 }
    if(userFound.status !== true) throw { msg: "deleted_user", status: 400 }   
    if(!userFound.isAlreadyConnected && userFound.passwordConnexion !== givenPassword) throw { status: 400, msg: "bad_user_data_1p" } 
    if(!userFound.isAlreadyConnected && userFound.passwordConnexion === givenPassword) throw { status: 200, msg: "first_connexion_ok" }
    return userFound
}