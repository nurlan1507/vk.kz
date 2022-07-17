import Cookie from "js-cookie";


const setCookie =(key,value)=>{
    Cookie.set(key,value,{
        path:"/",
        maxAge:900,
    })
}

export default setCookie