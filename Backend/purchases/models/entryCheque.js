const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const EntryCheque = sequelize.define('entryCheque',{
    entryId : {type : DataTypes.INTEGER, allowNull : false},
    distributorId : {type : DataTypes.INTEGER, allowNull : false},
    chequeNo : {type : DataTypes.STRING},
    amount : {type : DataTypes.FLOAT},
    chequeIssuedDate : {type : DataTypes.DATEONLY},
    chequeClearenceDate : {type : DataTypes.DATEONLY},
    closedDate : {type : DataTypes.DATEONLY},
    description : {type : DataTypes.STRING},
    status: {type : DataTypes.BOOLEAN, defaultValue : false},
    type: {type : DataTypes.STRING},
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = EntryCheque;


