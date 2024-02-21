const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const EntryDetails = sequelize.define('entryDetails',{
    entryId: {type : DataTypes.INTEGER, allowNull: false},
    productId : {type : DataTypes.INTEGER, allowNull: false},
    quantity : {type : DataTypes.FLOAT, allowNull: false},
    secondaryUnitId : {type : DataTypes.INTEGER, allowNull: false},
    mrp:{type: DataTypes.INTEGER},
    rate:{type: DataTypes.INTEGER, allowNull: false},
    discount : {type: DataTypes.INTEGER, defaultValue: 0},
    gstId : {type: DataTypes.INTEGER, },
    gross:{type: DataTypes.INTEGER, allowNull: false},
    net :  {type: DataTypes.INTEGER, allowNull: false}
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = EntryDetails;


