const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Gst = sequelize.define('gst',{
    //id : { type : DataTypes.NUMBER, primaryKey : true, allowNull : false, autoIncrement : true},
    gstName : {type : DataTypes.STRING, allowNull : false},
    igst : {type : DataTypes.FLOAT, allowNull : false},
    cgst :  {type : DataTypes.FLOAT},
    sgst :  {type : DataTypes.FLOAT},
    status: {type : DataTypes.BOOLEAN, defaultValue : true},
},
{
    freezeTableName: true,
    timestamps : false
})

module.exports = Gst;


