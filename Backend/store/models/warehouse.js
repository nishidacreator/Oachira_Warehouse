const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Warehouse = sequelize.define('warehouse',{
    warehouseName : {type : DataTypes.STRING, allowNull : false},
    warehouseLocation : {type : DataTypes.STRING, allowNull : false},
    warehouseInChargeId : {type : DataTypes.INTEGER, allowNull : false},
    phoneNumber : {type : DataTypes.STRING, allowNull : false},
    panNo : {type : DataTypes.STRING},
    fssaiNo : {type : DataTypes.STRING},
    gstIn : {type : DataTypes.STRING},
    state : {type : DataTypes.STRING},
    
    status : {type : DataTypes.BOOLEAN, defaultValue : true}
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = Warehouse;


