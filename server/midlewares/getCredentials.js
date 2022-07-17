const tokenService = require('../service/tokenService')
const userService = require('../service/userService')
const ActiveUser = require('../session/activeUser')


module.exports= async(req,res,next)=>{
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    console.log(accessToken)
    return res.json(accessToken)

}