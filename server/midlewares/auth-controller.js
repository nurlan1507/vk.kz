const tokenService = require('../service/tokenService')
const userService = require('../service/userService')
const ActiveUser = require('../session/activeUser')


// function parseCookies (request) {
//     const list = {};
//     const cookieHeader = request.headers?.cookie;
//     if (!cookieHeader) return list;
//
//     cookieHeader.split(`;`).forEach(function(cookie) {
//         let [ name, ...rest] = cookie.split(`=`);
//         name = name?.trim();
//         if (!name) return;
//         const value = rest.join(`=`).trim();
//         if (!value) return;
//         list[name] = decodeURIComponent(value);
//     });
//
//     return list
// }
//

module.exports = async function (req,res,next) {
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000");

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);



    try {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;
        console.log(req.cookies)
        console.log(accessToken)
        console.log("LOLOL")
        const userData = await tokenService.validateAccessToken(accessToken);
        if(!userData){
            if(refreshToken){
                req.newTokens = await userService.refresh(refreshToken)
                res.cookie('refreshToken', req.newTokens.tokens.refreshToken,{maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true} )
                res.cookie('accessToken', req.newTokens.tokens.accessToken,{maxAge: 60*15* 1000, httpOnly: true} )
                req.token = req.newTokens.tokens.accessToken
            }
            else{
                return res.json({msg:"unAuth"})
            }
        }
        return next();
    }
    catch (e) {
        console.log(e)
    }
}