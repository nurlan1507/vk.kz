import React from 'react'
import axios from 'axios'
import decode from 'jwt-decode'
import setCookie from "../CookieHooks/setCookie";
import getCookie from "../CookieHooks/getCookie";



class AuthController{
    getProfile() {
        const userData = decode(localStorage.getItem('accessToken'))
        console.log(userData)
        return userData
    }



    getToken() {
        return getCookie('accessToken');
    }


    setNewToken() {
        axios.get('http://localhost:5000/api/getCookies', {withCredentials: true}).then((res) => {
            setCookie('accessToken', res.data.accessToken)
        })
    }


    logout() {
        localStorage.removeItem('accessToken');
    }
}


    export default new AuthController()