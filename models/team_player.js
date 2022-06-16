const Sequelize = require('sequelize');

const sequelize = require('../config/db');    
    
const team_player = sequelize.define('team_players', {  
id:{
type:Sequelize.NUMBER,    
allowNull:false,    
primaryKey:true,    
autoIncrement: true    
  },   
  
  team_id:{
    type:Sequelize.NUMBER, 
    allowNull:true,
  
  },
    // attributes    
    player_id: {
        type: Sequelize.STRING,
        allowNull: true
    },
      
},{ 
    timestamps: true,
 
 });    
    
  module.exports =team_player;    
