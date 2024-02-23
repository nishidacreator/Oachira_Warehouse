const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const EntryDetails = sequelize.define('entryDetails',{
    entryId: {type : DataTypes.INTEGER, allowNull: false},
    productId : {type : DataTypes.INTEGER, allowNull: false},
    quantity : {type : DataTypes.FLOAT, allowNull: false},
    secondaryUnitId : {type : DataTypes.INTEGER, allowNull: false},
    mrp:{type: DataTypes.FLOAT},
    rate:{type: DataTypes.FLOAT, allowNull: false},
    discount : {type: DataTypes.FLOAT, defaultValue: 0},
    gstId : {type: DataTypes.INTEGER, },
    taxableAmount : {type: DataTypes.FLOAT},
    grossAmount:{type: DataTypes.FLOAT, allowNull: false},
    netAmount :  {type: DataTypes.FLOAT, allowNull: false}
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = EntryDetails;


