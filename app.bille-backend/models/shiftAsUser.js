const { DataTypes } = require('sequelize')
const { sequelize } = require('../db/sequelize')

const ShiftAsUser = sequelize.define('shiftAsUser', {
    idShiftAsUser: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    idUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User',
            key: 'idUser'
       }
    },
    idShift: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Shift',
            key: 'idShift'
       }
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,  
    }
}, {
    createdAt: false,
    updatedAt:false,
    freezeTableName: true
})

module.exports = ShiftAsUser