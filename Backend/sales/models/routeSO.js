const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const RouteSO = sequelize.define('routeSO',{
    routeId : {type : DataTypes.INTEGER, allowNull : false},
    customerId  : {type : DataTypes.INTEGER, allowNull : false},
    date : {type : DataTypes.DATEONLY, allowNull : false, defaultValue : new Date()},
    status : {type : DataTypes.STRING, allowNull : false, defaultValue : 'Created'},
    salesExecutiveId : {type : DataTypes.INTEGER, allowNull : false},
    deliveryDate : {type : DataTypes.DATEONLY, allowNull : false}
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = RouteSO;


