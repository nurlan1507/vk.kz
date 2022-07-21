import React, {useEffect,useState} from "react"
import Authorization from "./pages/authotization/authorization"
import {BrowserRouter as Router, Routes,Route} from "react-router-dom";
import MainPage from './pages/mainpage/main'
import io from 'socket.io-client'
import userService from "./api/userService";



const socket = io.connect("http://localhost:5000")







    export default function App(){
        const [avatar, setAvatar] = useState(null)
        const [userInfo, setUserInfo] = useState(null)
        useEffect(()=>{
            const profile = userService.getUserData().then(res=>{
                console.log(res.avatar)
                setAvatar(res.avatar)
                setUserInfo(res)
            })
        },[])


    socket.on("hello",()=>{
        console.log('hello')
    })





    return (
            <Router>
                <Routes>
                    <Route path="/auth"   element={<Authorization avatar={avatar} userInfo={userInfo} />}/>
                    <Route path="/main" element={<MainPage avatar={avatar} userInfo={userInfo} />}/>
                </Routes>

            </Router>
    )
}