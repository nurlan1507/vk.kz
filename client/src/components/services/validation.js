
import {useEffect, useState} from "react";
import {useFormik} from "formik"





const useInput = (initValue,validations)=>{
    const [value,setValue] = useState(initValue)
    const [isDirty, setDirty] = useState(false)
    const [passwordsAreEqual, setPasswordsAreEqual] = useState(false)
    // const [isEmpty, setEmpty] = useState(false)
    const valid = useValidation(value,validations)

    const onChange=(e)=>{
        setValue(e.target.value)
        console.log(value)
    }
    const onBlur=(e)=>{
        setDirty(true)
        console.log(value)
    }
    const passwordEquals=(e)=>{
        if(value===e.target.value && value!==''){
            alert(value)
            setPasswordsAreEqual(true)
        }
        else{
            setPasswordsAreEqual(false)
        }

        console.log(value)

    }

    return{
        value,
        onChange,
        onBlur,
        ...valid,
        isDirty,
        passwordEquals,
        passwordsAreEqual
    }
}


const useBusyEmail =(initValue,isBusy)=>{
    const[value,setValue] = useState('')
    const[EmailIsBusy, setBusiness] = useState(false);
    if(isBusy){
        setBusiness(true)
    }
    const onChange =(e)=>{
        console.log(e.target.value)
        setValue(e.target.value)
    }
    return{
        value,
        onChange,
        EmailIsBusy,
    }
}






const useValidation = (value,validations)=>{
    const [isEmpty , setEmpty] = useState(true);
    const [minLengthError, setMinLengthError] = useState(false)
    const [maxLengthError, setMaxLengthError]= useState(false)
    const [emailError, setEmailError] = useState(false)
    const [isValidGEN, setValidGEN] = useState(false)
    useEffect( ()=>{
        console.log("ЗАПУСТИЛ ХУК")
        for(const validation in validations) {
            switch (validation) {
                case 'minLength' :
                    value.length < validations[validation] ? setMinLengthError(true) : setMinLengthError(false)
                    break
                case 'isEmpty':
                    value ? setEmpty(false) : setEmpty(true)
                    break
                case 'maxLength':
                    value.length > validations[validation] ? setMaxLengthError(true) : setMaxLengthError(false)
                    break
                case 'emailError':
                    (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) ? setEmailError(false) :setEmailError(true)
                    break
            }
        }
    },[value])
    useEffect(()=> {
        if (isEmpty || minLengthError || emailError) {
            setValidGEN(false)
        } else {
            setValidGEN(true)
        }
    },[emailError,isEmpty,minLengthError])

    return {
        isEmpty,
        maxLengthError,
        minLengthError,
        emailError,
        isValidGEN
    }
}




export {useValidation,useInput,useBusyEmail}