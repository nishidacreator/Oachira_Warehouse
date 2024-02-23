const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Request = sequelize.define('request',{
    requestNo : {type : DataTypes.STRING, allowNull: false},
    companyId : {type : DataTypes.INTEGER, allowNull : false},
    userId : {type : DataTypes.INTEGER, allowNull : false},
    date : {type : DataTypes.DATEONLY, allowNull : false},
    status : {type : DataTypes.STRING, defaultValue : "Raised"}
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = Request;


