const { DataTypes } = require('sequelize')
const { sequelize } = require('../db/sequelize')

const User = sequelize.define('user', {
    idUser: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
       type: DataTypes.STRING,
       allowNull: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false ,
     },
     adminLevel: {
        type: DataTypes.INTEGER,
        allowNull: false
     },
     passwordConnexion: {
        type: DataTypes.STRING,
        allowNull: true
     },
     isAlreadyConnected: {
        type: DataTypes.BOOLEAN,
        allowNull: false
     }
}, {
    createdAt: false,
    updatedAt:false,
    freezeTableName: true
})

module.exports = User