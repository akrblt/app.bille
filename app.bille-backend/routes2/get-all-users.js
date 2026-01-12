const { notEqual } = require("assert")
const User = require("../models/user")
const { Op } = require('@sequelize/core');

module.exports = (app) => {
    app.get('/api/getAllUsers', async function (req, res) {
        try{
            const users = await getAllEnabledUsers()
            if(!users || users.length === 0) throw new Error()
            return res.status(200).send({msg: 'success', data: users})
        }catch(error){
            //console.log("1: ", error)
            const stat = 400
            return res.status(stat).send({msg: 'failed'})
        }
    })
}

async function getAllEnabledUsers(){
    try{
        const usersFounded = await User.findAll({
            where: { 
                status: true, 
                login: { [Op.ne]: "admin" } 
            },
            attributes: ['idUser', 'firstname', 'login', 'adminLevel', 'isAlreadyConnected', 'passwordConnexion'],
            order: ['firstname']
        })
        const resultFiltred = usersFounded.map((user) => user.dataValues)
        return resultFiltred
    }catch(error){
        //console.log("2: ", error)
        return null
    }
    
}