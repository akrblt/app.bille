const { DataTypes } = require('sequelize')
const { sequelize } = require('../db/sequelize')

const Shift = sequelize.define('shift', {
    idShift: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    fkLaBilleShow: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'LaBilleShow',
            key: 'laBilleShowId'
        }
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    maxUsers: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false,
        get() {
            return this.getDataValue('startTime') ? this.getDataValue('startTime').slice(0, 5) : null; // Format hh:mm
        },
        set(value) {
            this.setDataValue('startTime', `${value}:00.000000`); // Format hh:mm:ss.ssssss pour la DB
        }
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false,
        get() {
            return this.getDataValue('endTime') ? this.getDataValue('endTime').slice(0, 5) : null; // Format hh:mm
        },
        set(value) {
            this.setDataValue('endTime', `${value}:00.000000`); // Format hh:mm:ss.ssssss pour la DB
        }
    },
    indexForType: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    createdAt: false,
    updatedAt:false,
    freezeTableName: true
})

module.exports = Shift