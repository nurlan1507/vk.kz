const userService = require("../service/userService");
const tokenService = require("../service/tokenService")


//validation
const validation = require('express-validator');
const e = require("express");





class userController{
    async registration(req,res,next) {
        try {
            const {email,password,name,surname,number,birthday} = req.body
            const userData = await userService.registration(email, password,name,surname,number,birthday)
            if(userData instanceof Error){
                return res.json({msg: userData.message})
            }
            const accessToken = userData.tokens.accessToken
            const refreshToken = userData.tokens.refreshToken
            // req.universalCookies.set('accessToken', userData.tokens.accessToken,{path:'/',maxAge:"1800",httpOnly:true})
            // req.universalCookies.set('refreshToken', userData.tokens.accessToken,{path:'/',maxAge:"2592000",httpOnly:true})
            res.cookie('accessToken', accessToken, {maxAge:60*1000*15, httpOnly:true})
            res.cookie("refreshToken", refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        }catch (e){
        }

    }


    async login(req,res,next){
        try{
            const {email,password} = req.body;
            const userData = await userService.login(email,password);
            if(userData instanceof Error){
                return res.json({msg:userData.message});
            }
            res.cookie('accessToken', userData.tokens.accessToken, {maxAge:15*60*1000, httpOnly:true})
            res.cookie('refreshToken', userData.tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json({userData:userData})
        }catch (e){

        }
    }


    async logout(req,res,next){
        try{
            const refreshToken = req.cookies.refreshToken;
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            res.json(token)
        }catch (e){
            console.log(e)
        }
    }


    async refresh(req,res,next){
        try{
            const {refreshToken} = req.cookies
            console.log(refreshToken)
            const userData = await userService.refresh(refreshToken);
            if(userData instanceof Error){
                res.json(userData.message);
            }
            // req.universalCookies.set('refreshToken', userData.tokens.accessToken,{path:'/',maxAge:"2592000",httpOnly:true})
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData)
        }catch (e){
        }
    }

    async searchForExisting(req,res,next) {
        const {email} = req.body
        console.log(email)

        if (await userService.findExisting(email) instanceof Error) {
            console.log('аккаугь уже существует')
            return res.json({msg:false, email:email})
        }
        return res.json({msg:true,email:email})
    }


    async accountConfirmation(req,res,next){
        const {email,code} = req.body
        console.log(email,code)
        const result = await userService.confirmUser(email,code)
       if(result===true){
           return res.json({msg:true})
       }
       else{
           return  res.json({msg:false})
       }
    }




    async getUsers(req,res,next){
        try{
            return  res.json({msg:'users'})
        }catch (e) {
            
        }
    }


    async getUserAvatarInfo(req,res,next){
        const userData = await tokenService.validateAccessToken(req.token)
        if(!userData){
            return res.statusCode(401).json({msg:"UnAuth"})
        }
        const activeUser = await userService.getActiveUserInfo(userData.id)
        if(activeUser){
            console.log(activeUser)
            return res.statusCode(200).json(activeUser)
        }
        else return res.statusCode(401).json({msg:"UnAuth"})
    }

    async getUserInfo(req,res,next) {
        const id = req.body.id
        const info = await userService.getActiveUserInfo(id)
        if (!info) return res.json({msg: "UnAuth"})
        return res.json(info)
    }











    getCookies(req,res,next){
        const tokens = {
            accessToken: req.cookies.accessToken,
            refreshToken: req.cookies.refreshToken
        }
        console.log(tokens)
        console.log(req.cookies)
      return  res.json(req.user)
    }




}



module.exports = new userController()