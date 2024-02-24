const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const DailyCollection = sequelize.define('dailyCollection',{

    customerId : { type : DataTypes.INTEGER },
    amount: {type: DataTypes.FLOAT},
    date : { type : DataTypes.DATEONLY},
    invoiceNo : {type : DataTypes.STRING},
    userId : {type : DataTypes.INTEGER},
    paymentMode  : {type :DataTypes.STRING},
    remarks : { type : DataTypes.STRING},
    routeId : {type :DataTypes.INTEGER},
    creditBalance  : { type :DataTypes.FLOAT}








})

module.exports = DailyCollection