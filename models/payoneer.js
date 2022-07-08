const sequelize = rerquire('sequlize');
const { Sequelize } = require('sequelize/types');
const sequelize = require('../config/db');

const payoneer = sequlize.define('payoneer_transactions' ,{
    id:{
        type:Sequelize.Number,
        allowNull:false,
        primarykey:true,
        autoincrement:true
    },
    user_id:{

    },
    purchase_plan_id:{

    },
    payoneer_payment_id:{

    },
    payoneer_signature:{

    },
    currency:{

    },
    amount:{

    },
    payment_method:{

    },
    method_name:{

    },
    payment_status:{

    },
    response:{

    }
    },{ 
        timestamps: true,
        // defaultScope: {
        //     attributes: { exclude: ['otp'] }
        //   }
     });  

     module.exports = payoneer;  

