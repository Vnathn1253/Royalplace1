const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  'royal',
  'root',
  '',
  {
    dialect: "mysql",
    logging: false,
    host:'localhost',
  }
);
sequelize.authenticate().then(() =>
        console.log("Connected to the database !")
).catch((err)=>{
  console.log("eorrrrrr");
  console.log(err);
});

module.exports = sequelize;
