const jwt = require('jsonwebtoken')
const tokenModel = require('../models/token_model')
const userService = require("./userService");
class tokenService {
  async registerTokens(payload){
      const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn:"15m"});
      const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_SECRET, {expiresIn:"30d"})
      console.log(payload);
      const token = await tokenModel.create({user:payload, refreshToken:refreshToken})
      console.log(token)
      return {accessToken : accessToken, refreshToken: refreshToken}
  }

  async validateToken(token){
      if(token) {
          const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
          return user
      }
      else{
          return null
      }
  }

  async loginTokens(payload){
      const accessToken =  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn:"15m"});
      const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_SECRET, {expiresIn:"30d"});
      await tokenModel.findOneAndUpdate({user:payload.id}, {refreshToken:refreshToken,user:payload.id})
      return {accessToken:accessToken, refreshToken : refreshToken}
  }

  async createNewTokens(payload){
      console.log('CREATING NEW TOKENS')
      console.log(jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn:"15m"}));
       // const refreshToken =  jwt.sign(payload,process.env.JWT_REFRESH_SECRET, {expiresIn:"30d"});

      const update = await  tokenModel.findOneAndUpdate({user:payload._id}, {refreshToken:refreshToken , user:payload.id})
          console.log(await tokenModel.findOne({user:payload._id}).exec())
      console.log(update)
      return {accessToken:accessToken, refreshToken:refreshToken}
  }







}


module.exports = new tokenService();