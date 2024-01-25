const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Store = sequelize.define('store',{
    storeName : {type : DataTypes.STRING, allowNull : false},
    storeLocation : {type : DataTypes.STRING, allowNull : false},
    counterCount : {type : DataTypes.INTEGER, allowNull : false},
    storeInChargeId : {type : DataTypes.INTEGER, allowNull : false},
    phoneNumber : {type : DataTypes.STRING, allowNull : false},
    gstId : {type : DataTypes.INTEGER},
    storeBaseUrl : {type : DataTypes.INTEGER, allowNull : false},
    warehouseId : {type : DataTypes.INTEGER},
    status : {type : DataTypes.BOOLEAN, defaultValue : true}
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = Store;


