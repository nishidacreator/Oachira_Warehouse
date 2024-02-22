const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Company = sequelize.define('company',{
    companyName : {type : DataTypes.STRING},
    companyCode : {type : DataTypes.STRING},
    locationName : {type : DataTypes.STRING},
    companyInChargeId : {type : DataTypes.INTEGER},
    gstId : {type : DataTypes.INTEGER},
    isStore : {type : DataTypes.BOOLEAN},
    isWarehouse: {type : DataTypes.BOOLEAN},
    gstId: {type : DataTypes.STRING},
    apiKey: {type : DataTypes.STRING},
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = Company;


