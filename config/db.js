const Sequelize = require('sequelize');    
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASS, {    
  host: process.env.DB_HOST,    
  dialect: 'mysql',
  dialectOptions: {
    //socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock"
    logging:true
  },
});    
    
module.exports=sequelize;    