const mongoose = require('mongoose')
const Confirmation_code_schema = new mongoose.Schema({

    code:{
        type:String,
    },
    email:{
        type:String,
        index:true,
    },
    createdAt:{
        type: Date, expires: '5m', index: true,default:Date.now
    }
})
Confirmation_code_schema.index({'email':1});
const codeSchema =  mongoose.model('confirmation_codes', Confirmation_code_schema)

module.exports = codeSchema