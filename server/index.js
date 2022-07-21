require('dotenv').config();
var setCookie = require('set-cookie-parser');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const route = require('./routes/routes');




const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:3000'
    ],
    methods: ['GET', 'PUT', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
    credentials: true,
    maxAge: 600,
    exposedHeaders: ['*', 'Authorization' ]
}));


app.use('/api', route);
const PORT = process.env.PORT || 5000;
const databaseLink = process.env.DATABASE;

//socket
const socketService = require('./socket/socket');
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors:{
        origin:"*",
        methods:["GET","POST"],

    }
});












const start = async()=>{
    try{
        //socket
        io.on("connection", async(socket) => {
            console.log("USER LIUANCHED WEBSITE");
            socket.on('toMain', ()=>{
                socketService.toMain();
            })
        });
      mongoose.connect(databaseLink,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        }).then(()=>{
          console.log('mongodb connected')
      })
        httpServer.listen(PORT, ()=>{
            console.log('сервер запущен на порте '+ PORT);
        })
    }catch (e){
        console.log(e);
    }
}


start();
