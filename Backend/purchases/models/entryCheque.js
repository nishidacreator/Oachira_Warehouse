const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const EntryCheque = sequelize.define('entryCheque',{
    entryId : {type : DataTypes.INTEGER, allowNull : false},
    chequeNo : {type : DataTypes.STRING},
    amount : {type : DataTypes.FLOAT},
    date : {type : DataTypes.DATEONLY}
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = EntryCheque;


