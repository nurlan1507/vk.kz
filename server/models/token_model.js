const mongoose = require('mongoose')
const {model} = require("mongoose");

const TokenSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId, ref:'users',
    },
    refreshToken:{type:String}
})

module.exports = model('Token', TokenSchema);
