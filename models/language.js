const Sequelize = require('sequelize');    
const sequelize = require('../config/db');  

const language = sequelize.define('languages',{
id:{
type:Sequelize.NUMBER,
allowNull:false,
primaryKey:true,
autoIncrement:true
},
    langcode:{
      type:Sequelize.STRING, 
      allowNull:true
    },
    en_name:{
       type:Sequelize.STRING,
       allowNull:true
    },
    nativename:{
        type:Sequelize.STRING,
        allowNull:true
    },
    code:{
        type:Sequelize.STRING,
        allowNull:true
    },
    translated_word:{
        type:Sequelize.STRING,
        allowNull:true
    },
    // createdAt:{
    //     type:Sequelize.STRING,
    //     allowNull:true
    // },
    // updatedAt:{
    //     type:Sequelize.STRING,
    //     allowNull:true
    // },

},  {
    timestamp:true,

});

module.exports = language;
