import Cookie from "js-cookie";

const removeCookie =(key,value,options)=>{
    Cookie.remove(key)
}


export default removeCookie