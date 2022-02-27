const Sequelize = require("sequelize");

const sequelize = require("../db/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name:  {
    type: Sequelize.STRING,
    allowNull: false,
  },
  mobile_no: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique:true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  token: {
    type: Sequelize.STRING,
  },
});

module.exports = User;
