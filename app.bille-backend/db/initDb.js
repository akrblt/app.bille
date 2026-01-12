const { sequelize } = require('./sequelize')
const LaBilleShow = require('../models/laBilleShow')
const Shift = require('../models/shift')
const ShiftAsUser = require('../models/shiftAsUser')
const User = require('../models/user')
const ExtraTime = require('../models/extraTime')

async function init(){
    try{        
        /*********** Show <=> Shift ******************/
        LaBilleShow.hasMany(Shift, {
            as: 'shifts',
            foreignKey: 'fkLaBilleShow',
            onDelete: 'CASCADE',  
            hooks: true  
        })
        Shift.belongsTo(LaBilleShow, {
            foreignKey: 'fkLaBilleShow',
            as: 'show'
        })
        /*********** shift <=> user ******************/
        Shift.belongsToMany(User, { 
            through: ShiftAsUser,
            foreignKey: 'idShift',
            otherKey: 'idUser',
            as: 'shiftUsers'
        })
        User.belongsToMany(Shift, { 
            through: ShiftAsUser,
            foreignKey: 'idUser',
            otherKey: 'idShift',
            as: 'userShifts'
        })
        /*********** User <=> extraTime ******************/
        User.belongsToMany(LaBilleShow, { 
            through: ExtraTime,
            foreignKey: 'fkUser',
            otherKey: 'fkLaBilleShow',
            as: 'TimeExtraUser1'
        })
        LaBilleShow.belongsToMany(User, { 
            through: ExtraTime,
            foreignKey: 'fkLaBilleShow',
            otherKey: 'fkUser',
            as: 'openingClosures'
        })
        await sequelize.authenticate()
        console.log('connexion to db successfull')
    } catch(error){
        console.error(`unable to connect to db : ${error}`)
    }
}
module.exports = init 