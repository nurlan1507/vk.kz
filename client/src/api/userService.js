import React from 'react'
import axios from 'axios'
import authControlle from "../AuthController/authControlle";
import {Avatar} from "@mui/material";


const api = axios.create({
    baseURL:"http://localhost:5000/api",
    headers:{"authorization":`Bearer ${localStorage.getItem('accessToken')}`}
})

function makeLetterAvatar(user,name){
    return {initial:name[0].toUpperCase(), avatarColor:user.avatarColor}
}


class userService{
    getUserData(){
        const data =  authControlle.getProfile()
        return axios({
            method: 'POST',
            url: 'http://localhost:5000/api/getUserData',
            data: {id: data.id},
            withCredentials: true
        }).then((res) => {
            return res.data
        })
    }

    createPost(data){
        return api.post('/createPost',data, {
                headers: { 'Content-Type': 'application/json' }
            , withCredentials:true, }).then((res)=>{
            console.log(res.data);return res.data})
}

}


export default new userService()