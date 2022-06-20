const Sequelize = require('sequelize');    
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASS, {    
    host: process.env.DB_HOST,    
    dialect: 'mysql',
    options: {
        host: 'localhost',
        dialect: 'mysql',
        freezeTableName: true,
        define: {
            timestamps: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_bin',
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30 * 1000,
            idle: 10000,
        },
        dialectOptions: {
            decimalNumbers: true,
            charset: 'utf8mb4',
        },
        logging: false,
    }
});    
    
module.exports=sequelize;    