const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    surname:{
        type:String,
        required:true,
    },
    birthday:{
        type:Date,
    },
    number:{
        type:String,
    },
    confirmed:{
        type:Boolean,
        required:true,
    },
    avatar:{
        type:String,  //url
    },
    // isActivated:{
    //     type:Boolean,
    //     default:false,
    // },
    // activationLink:{
    //     type:String,
    //     required:true,
    // }
})

const Schema = mongoose.model('user', UserSchema)
module.exports = Schema