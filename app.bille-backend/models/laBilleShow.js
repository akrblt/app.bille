const { DataTypes } = require('sequelize')
const { sequelize } = require('../db/sequelize')

const LaBilleShow = sequelize.define('laBilleShow', {
    laBilleShowId: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    soundEngineer: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'User',
            key: 'idUser'
       }
    },
    showResponsable: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'User',
            key: 'idUser'
       }
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
       type: DataTypes.STRING,
       allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
     }
}, {
    createdAt: false,
    updatedAt:false,
    freezeTableName: true
})

module.exports = LaBilleShow