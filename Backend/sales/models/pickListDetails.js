const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const PickListDetails = sequelize.define('pickListDetails',{
    pickListId : {type : DataTypes.INTEGER, allowNull : false},
    productId  : {type : DataTypes.INTEGER, allowNull : false},
    quantity : {type : DataTypes.FLOAT, allowNull : false},
    secondaryUnitId : {type : DataTypes.INTEGER, allowNull : false}
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = PickListDetails;