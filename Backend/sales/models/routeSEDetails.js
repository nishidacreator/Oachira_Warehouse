const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const RouteSEDetails = sequelize.define('routeSEDetails',{
    routeSEId : {type : DataTypes.INTEGER, allowNull : false},
    productId  : {type : DataTypes.INTEGER, allowNull : false},
    quantity : {type : DataTypes.FLOAT, allowNull : false},
    secondaryUnitId : {type : DataTypes.INTEGER, allowNull : false},
    hsnCode : {type : DataTypes.STRING},
    gst : {type : DataTypes.STRING},
    mrp : {type : DataTypes.FLOAT},
    rate : {type : DataTypes.FLOAT, allowNull : false},
    amount : {type : DataTypes.FLOAT},
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = RouteSEDetails;