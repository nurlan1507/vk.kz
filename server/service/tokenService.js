const jwt = require('jsonwebtoken')
const tokenModel = require('../models/token_model')
const userService = require("./userService");
class tokenService {
    async generateTokens(payload) {
        const accessToken = jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{expiresIn: "15m"});
        const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{expiresIn:"30d"});
        return {accessToken:accessToken,refreshToken:refreshToken}
    }
    async saveToken(userId, refreshToken){
        const tokenData = await tokenModel.findOne({user:userId});
        if(tokenData){
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await tokenModel.create({user:userId, refreshToken:refreshToken});
        return token;
    }

    // async deleteToken(refreshToken){
    //     return await tokenModel.deleteOne({ref})
    // }

    async validateAccessToken(token){
        try{
            return await jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        }catch (e){
            return null
        }
    }


    async validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        }catch (e){
            return null
        }
    }
    async removeToken(refreshToken){
        console.log(refreshToken)
        const tokenData =await tokenModel.deleteOne({refreshToken:refreshToken});
        console.log(tokenData)
        return tokenData
    }
    async findToken(refreshToken){
        const tokenData = await tokenModel.find({refreshToken:refreshToken})
        return tokenData
    }

    async findUser(refreshToken){
        const userId = await tokenModel.findOne({refreshToken:refreshToken}).exec();
        return userId.user
    }


    // async createNewTokens(accessToken,refreshToken){
    //     if(!accessToken){
    //         if(refreshToken){
    //             const newTokens = await userService.refresh(refreshToken)
    //             console.log(newTokens)
    //             console.log("Создали новые токены")
    //             return newTokens;
    //         }
    //     }
    // }
}


module.exports = new tokenService();