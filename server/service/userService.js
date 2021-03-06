require('dotenv').config()
const userModel = require('../models/user_model')
const tokenModel = require('../models/token_model')
const codeModel = require('../models/confirmation_code_model')
const tokenService = require('../service/tokenService')


//validation
const validator = require('express-validator');

//number validation api
const numVerify = require('awesome-phonenumber')
//number SMS sending API
const sendSMS = require('./twilio')



//nodemailer
const nodemailer = require('nodemailer')
const randomString = require('randomstring') //для верификации



let transport = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
});




//bcrypt
const bcrypt = require('bcrypt');
const {validationResult} = require("express-validator");

const saltRounds = 10
const myPlaintextPassword = 's0/\/\P4$$w0rD'


const userDto = require('../dtos/user-dtos');

class userService {
        async registration(email,password,name,surname,number,birthday){
            const colors=['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
            const ind = parseInt(Math.random()*5)
            //если есть номер то валидируем его и отпрввляем смс
            if(number) {
                if(numVerify(number).isValid() ===false ){
                    return new Error('ввёденный телефон не валидный ')
                }
                //отправка смс
                sendSMS(number,'hello, my name is nurlan, welcome to VK.kz')
            }
            const user = await userModel.findOne({email:email})
            if(user){
                return new Error(`пользователь с ${email} уже существует`)
            }
            const hashPassword = await bcrypt.hash(password,saltRounds)
            const code =randomString.generate({length: 4, charset: 'alphabetic',})
            const newUser = new userModel({
                email:email,
                password :hashPassword,
                name:name,
                surname:surname,
                number:number,
                birthday:birthday,
                confirmed:false,
                avatar:`https://ui-avatars.com/api/?name=${name}+${surname}`
            })

            const confirmationCode = new codeModel({
                code: code,
                email:email,
                ttl:20,
            });

            await confirmationCode.save()

            //далее здесь после нажатия на кнопку отправляется код для подтверждения на имейл
            await newUser.save()
            await this.sendMail(email,code)



           const tokens =  await tokenService.registerTokens({...newUser});
            return {tokens:tokens, user:newUser}
        }

        async login(email,password){
            if(email==='' || password ===''){
                return new Error('Форма не может быть пустой')
            }
            const user = await userModel.findOne({email:email})

            if(!user){
                return new Error('Пользователя не существует')
            }
            const isMatch = await bcrypt.compare(password,user.password)
            if(!isMatch){
                return new Error('Введён неверный пароль')
            }


            const tokens = await tokenService.loginTokens({...user})

            return {tokens:tokens, user:user}
        }


        async logout(refreshToken){
            const token = await tokenService.removeToken(refreshToken);
            return token;
        }
            



        async findExisting(email){
            const user = await userModel.findOne({email:email})
            if(user){
                return new Error("изивините но почта уже занята")
            }
            else{
                return null
            }
        }


        async sendMail(email,code){
            const confirmationMessage = `<h2 style="color:#ff6600;">Hello, welcome to vk.kz here is your account  confirmation code :${code} </h2>     
`
            const mailOptions = {
                from: process.env.EMAIL_USERNAME , // Sender address
                to: email, // List of recipients
                subject: 'Node Mailer', // Subject line
                html: confirmationMessage,
            };

           await  transport.sendMail(mailOptions, function(err, info) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(info);
                }
            });
        }



        async confirmUser(email,code){
            console.log(email)
            const confirmation = await codeModel.findOne({email:email, code:code})
            console.log(confirmation)
            if(confirmation){
               const user= await userModel.findOneAndUpdate({email:email}, {confirmed:true})
                await confirmation.delete()
                console.log(user)
                return true
            }
            else{
                return false
            }
        }

        async refresh(refreshToken){
            if(!refreshToken){
                return new Error('unAuth')
            }
            const tokenObjectInDB = await tokenModel.findOne({refreshToken:refreshToken}).exec()
            if(!tokenObjectInDB){
                return new Error("unAuth")
            }
            const DBToken = tokenObjectInDB.refreshToken
            const user = await userModel.findById(tokenObjectInDB.user)
            console.log(user)
            const newTokens = await tokenService.createNewTokens(user)
            return newTokens
        }


        async getActiveUserInfo(id){
            const activeUser = await userModel.findById(id)
            return activeUser
        }
}
















module.exports = new userService()