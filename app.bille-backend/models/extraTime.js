const { DataTypes } = require('sequelize')
const { sequelize } = require('../db/sequelize')

const ExtraTime = sequelize.define('extraTime', {
    idExtraTime: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    fkUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'idUser'
        }
    },
    fkLaBilleShow: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'LaBilleShow',
            key: 'LaBilleShowId'
        }
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    createdAt: false,
    updatedAt:false,
    freezeTableName: true,
})

module.exports = ExtraTime