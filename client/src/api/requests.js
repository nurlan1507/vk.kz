import React from 'react'
import axios from 'axios'
import getCookie from "../CookieHooks/getCookie";


const headers={
    'authorization':`Bearer ${localStorage.getItem('accessToken')}`,
}




class axiosClass{
    uploadImage(e){
        alert('приступим')
        let formData = new formData()
        formData.append('file',e.target.files[0])
        return axios({method:'post',url:'http://localhost:5000/api/uploadImg', data:formData, headers:{
                'authorization':`Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'multipart/form-data',
            }}).then((res)=>{
                console.log(res)
                return res.data
        })

    }
}





export default new axiosClass()