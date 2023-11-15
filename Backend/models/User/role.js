const { DataTypes } = require('sequelize');
const sequelize = require('../../utils/db');

const Role = sequelize.define('role',{
    //id : { type : DataTypes.NUMBER, primaryKey : true, allowNull : false, autoIncrement : true},
    roleName : {type : DataTypes.STRING, allowNull : false},
    status : {type : DataTypes.BOOLEAN, defaultValue : true}
},
{
    freezeTableName: true,
    timestamps : false
})


module.exports = Role;


