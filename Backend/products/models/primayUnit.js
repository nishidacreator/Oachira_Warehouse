const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const PrimaryUnit = sequelize.define('primaryUnit',{
    primaryUnitName : {type : DataTypes.STRING, allowNull : false},
    factor : {type : DataTypes.FLOAT, allowNull : false, defaultValue :1},
    status: {type : DataTypes.BOOLEAN, defaultValue : true}
},
{
    freezeTableName: true,
    timestamps: false
})

module.exports = PrimaryUnit;


