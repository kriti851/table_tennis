const Sequelize = require('sequelize');    
const sequelize = require('../config/db');    
    
const manage_training = sequelize.define('manage_trainings', {  
    id:{
        type:Sequelize.NUMBER,    
        allowNull:false,    
        primaryKey:true,    
        autoIncrement: true    
    },    
    user_id:{
        type:Sequelize.NUMBER, 
        allowNull:true,
    },
    racket: {
        type: Sequelize.STRING,
        allowNull: true
    },
    ball: {
        type: Sequelize.STRING,
        allowNull: true
    },
    person_position: {
        type: Sequelize.STRING,
        allowNull: true
    },
    foot_position:{
        type: Sequelize.STRING,
        allowNull: true
    },
    head_position:{
        type: Sequelize.STRING,
        allowNull: true
    }, 
    arm_position:{
        type: Sequelize.STRING,
        allowNull: true
    }, 
    hand_position:{
        type: Sequelize.STRING,
        allowNull: true
    },
    wrist_movements:{
        type: Sequelize.STRING,
        allowNull: true
    },    
},{ 
    timestamps: true,
 
 });    
    
  module.exports =manage_training;    