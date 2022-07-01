const Sequelize = require('sequelize');    
const sequelize = require('../config/db');    
    
const user = sequelize.define('users', {  
    id:{
        type:Sequelize.NUMBER,    
        allowNull:false,    
        primaryKey:true,    
        autoIncrement: true    
        },    
    // attributes    
    name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    user_type: Sequelize.ENUM(['admin', 'coach', 'user', 'player']),
    username: {
        type: Sequelize.STRING,
        allowNull: true
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: true
    },
    playing_style: {
        type: Sequelize.STRING,
        allowNull: true
    },
    email:{
        type:Sequelize.STRING,    
        allowNull:true,
        validate: {
            isEmail:true
        },
        unique: {
            args: true,
            msg: 'Email address already in use!'
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: true
    },
    confirmpassword:{
        type:Sequelize.STRING,
        allowNull:true
    },
    image:{
        type: Sequelize.STRING,
        allowNull: true
    },
    // video:{
    //     type: Sequelize.STRING,
    //     allowNull: true
    // },
    gender: Sequelize.ENUM(['male', 'female', 'other']),

    dob: {
        type: Sequelize.DATE,
        allowNull: true
    },
    career: {
        type: Sequelize.STRING,
        allowNull: true
    },
    nationality: {
        type: Sequelize.STRING,
        allowNull: true
    },
    team: {
        type: Sequelize.STRING,
        allowNull: true
    },
    club: {
        type: Sequelize.STRING,
        allowNull: true

    },
    dob: {
        type: Sequelize.STRING,
        allowNull: true
    },
    grip: {

        type: Sequelize.STRING,
        allowNull: true
    },
    height: {
        type: Sequelize.DECIMAL,
        allowNull: true
    },
    hand: {
        type: Sequelize.STRING,
        allowNull: true
    },
    otp: {
        type: Sequelize.STRING,
        allowNull: true
    },  
    default_lang: {
        type: Sequelize.STRING,
        allowNull: true
    }, 
    location: {
        type: Sequelize.STRING,
        allowNull: true
    },
    awards: {
        type: Sequelize.STRING,
        allowNull: true
    },
    tournament_played:{
        type: Sequelize.INTEGER,
        allowNull: true
    },
     achievements:{
        type: Sequelize.INTEGER,
        allowNull: true
    },
    street_address1: {
        type: Sequelize.STRING,
        allowNull: true
    },
    street_address2: {
        type: Sequelize.STRING,
        allowNull: true
    },
    favorite_serve:{
        type: Sequelize.STRING,
        allowNull: true

    },
    zip_code: {
        type: Sequelize.STRING,
        allowNull: true
    },
    card_no: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
     cvc_no: {
        type: Sequelize.STRING,
        allowNull: true
    }, 
     expiry_month: {
        type: Sequelize.INTEGER,
    },
    expiry_year: {
        type: Sequelize.INTEGER,
    },
    // deletedAt: {
    //     type: Sequelize.DATE,
    // },
    
},{ 
    timestamps: true,
    // defaultScope: {
    //     attributes: { exclude: ['otp'] }
    //   }
 });    
    
  module.exports = user;    


