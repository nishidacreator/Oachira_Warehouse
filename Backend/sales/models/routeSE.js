const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const RouteSE = sequelize.define('routeSE',{
    routeSOId : {type: DataTypes.INTEGER, allowNull : false},
    invoiceNo : {type: DataTypes.STRING, allowNull : false},
    totalAmount : {type: DataTypes.FLOAT},
    userId : {type: DataTypes.INTEGER, allowNull :false},
    paymentMode : {type: DataTypes.STRING},
    invoiceDate : {type: DataTypes.DATE, defaultValue : new Date()},
    creditBalance : {type: DataTypes.FLOAT},
    status : {type: DataTypes.STRING, defaultValue: 'Issued'}
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = RouteSE
