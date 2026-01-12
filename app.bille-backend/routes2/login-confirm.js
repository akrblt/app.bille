const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/user')

// ce endpoint attend 2 parametres : login & password
module.exports = (app) => {
    app.post('/api/confirmLogin', async (req, res) => {
        const login = req.body.login
        const firstPassword = req.body.firstPassword
        const secondPassword = req.body.secondPassword
        //console.log("body : ", req.body)
        try{
            if(firstPassword !== secondPassword) throw { status: 400, msg: "bad_user_data_p" }       
            const cryptedPassword = await bcrypt.hash(firstPassword, 10)
            let userData = await getActivUserByLogin(login)
            userData.set({
                isAlreadyConnected: 1,
                password: cryptedPassword,
                passwordConnexion: null
            })
            await userData.save()
            const accessToken = jwt.sign(userData.toJSON(), process.env.ACCESS_TOKEN_SECRET)
            //console.log("data : ", userData.dataValues)
            return res.status(200).send({status: "success_login", msg: "success_login", data: userData.dataValues, token: accessToken})
        }catch(error){
            console.error(error)
            return res.status(error.status || 500).send({ status: "fail", msg: error.msg || 'strange_error' })
        }
    })
}
async function getActivUserByLogin(givenLogin){
    const search = await User.findOne({ where: {login: givenLogin }})
    const userFound = search.dataValues
    if(!userFound) throw { msg: "bad_user_data_l", status: 400 }
    if(userFound.status !== true) throw { msg: "deleted_user", status: 400 }   
    return search
}