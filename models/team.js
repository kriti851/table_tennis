const Sequelize = require('sequelize'); 
const team_player = require("./team_player");     
const sequelize = require('../config/db');    
    
const team = sequelize.define('teams', {  
id:{
type:Sequelize.NUMBER,    
allowNull:false,    
primaryKey:true,    
autoIncrement: true    
  },   
  
  created_by:{
    type:Sequelize.NUMBER, 
    allowNull:true,
  
  },
    team_name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    image: {
        type: Sequelize.STRING,
        allowNull: true
    },
    team_activity: {
      type: Sequelize.STRING,
      allowNull: true
    },
    who_can_post: {
      type: Sequelize.STRING,
      allowNull: true
    },
    invite: {
      type: Sequelize.STRING,
      allowNull: true
    },
    team_notification: {
        type: Sequelize.STRING,
        allowNull: true
    },
    location: {
        type: Sequelize.STRING,
        allowNull: true
    },    
},{ 
    timestamps: true}); 

    team.hasMany(team_player, {
      foreignKey: {
        name: 'team_id',
        allowNull: false,
      },
      // sourceKey : 'id',
      // as : 'image'
    })
    
  module.exports =team;    
