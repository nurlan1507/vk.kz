import React, {useEffect, useState} from 'react'
import './modal-wind-auth.css'
import {useInput} from "../../components/services/validation";
import axios from "axios";
import {Button, Col, Form, Row} from "react-bootstrap";
import OutputAlert from "../../components/services/alerts";
import registerImg from '../../public/factory/login.svg'
import {CCloseButton} from '@coreui/react'
import { useNavigate} from "react-router-dom";
//cookieHooks


import io from 'socket.io-client'
import setCookie from "../../CookieHooks/setCookie";
const socket = io.connect("http://localhost:5000")






var regEmail



const RegistrationAdditional=({ AdditionalActive,setAdditional,setActive,setMainActive ,confirmation,setConfirmation})=>{
    const name = useInput("",{isEmpty:true, isAlpha:false})
    const surname = useInput("",{isEmpty:true, isAlpha:false})
    const date = useInput('',{isEmpty:true})
    const number = useInput('')
    const password = useInput("",{isEmpty:true, minLength:6, maxLength:16})
    const passwordRepeat = useInput("",{isEmpty:true,})
    const[equalPasswords, setEqualPasswords] = useState(false)
    const [numberMessage, setNumberMessage] = useState('')
    const [numValid,setNumValid]= useState(true)



    function registration(){
        alert(number.value)
        axios({
            method:'post',
            url:'http://localhost:5000/api/register',
            data:{
                email:regEmail,
                name:name.value,
                surname:surname.value,
                birthday: date.value,
                password:password.value,
                number: number.value
            },
        }).then((res)=>{
            setNumberMessage(res.data.msg)
            console.log(res.data)
            localStorage.setItem("accessToken", res.data.tokens.accessToken)
            setNumValid(false)
            console.log(res.data)
        })
    }
    function checkPassword(){
        console.log("ЧЕКАЮ")
        return passwordRepeat.value === password.value;
    }



    function chainExample(){

        return(
            <div className="wrapper">
                <Row>
                    <Col className={'d-flex justify-content-start'}> <Button className={'h-50 '} onClick={
                        ()=>{setMainActive(true); setAdditional(false)}
                    } style={{borderRadius:"100%"}}><i className="arrow left"/></Button></Col>
                    <Col><h3 style={{textAlign: "center"}}>Дополнительные данные</h3></Col>
                    <Col className={'d-flex justify-content-end'}><CCloseButton onClick={() => {
                        setActive(false)
                    }}/></Col>
                </Row>
                <Form className="form-main">
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Имя</Form.Label>
                        <Form.Control className="w-100" type="text" placeholder={(name.isEmpty && name.isDirty) &&"поле не может быть пустым"} onChange={(e)=>name.onChange(e)} onBlur={(e)=>{
                            name.onBlur(e)
                        }}/>
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Фамилия</Form.Label>
                        <Form.Control  className="w-100" type="text" placeholder={(surname.isEmpty && surname.isDirty) &&"поле не может быть пустым"} onChange={(e)=>{surname
                            .onChange(e)}} onBlur={(e)=>{surname.onBlur(e)}}/>
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3 w-75" controlId="formBasicPassword">
                        <Form.Label>выберите вашу дату рождения</Form.Label>
                        <Form.Control type="date"/>
                    </Form.Group>
                    <Form.Group className="mb-3 w-75" controlId="formBasicPassword">
                        <Form.Label>Номер телефона(по желанию)</Form.Label>
                        <Form.Control type="text" onChange={(e)=>number.onChange(e)} onBlur={(e)=>number.onBlur(e)}/>
                    </Form.Group>
                    <Form.Group className="mb-3 w-75" controlId="formBasicPassword">
                        <Form.Label>Введите пароль</Form.Label>
                        <Form.Control type="password" className="w-100" placeholder="Password"
                                      onBlur={e => password.onBlur(e)} value={password.value}
                                      onChange={(e) => {
                                          password.onChange(e);
                                passwordRepeat.passwordEquals(e)}}  />
                    </Form.Group>
                    <Form.Group className="mb-3 w-75" controlId="formBasicPassword">
                        <Form.Label>Повторите пароль</Form.Label>
                        <Form.Control type="password" className="w-100" placeholder="Password"
                                      onBlur={e => passwordRepeat.onBlur(e)} value={passwordRepeat.value}
                                      onChange={e => {
                                          passwordRepeat.onChange(e)
                                          password.passwordEquals(e)
                                      }}/>
                        {(!numValid) && <OutputAlert message={numberMessage} variant={'danger'}/>}
                        {(password.isDirty && password.isEmpty) && <OutputAlert message={"Ячейка паролей не должна быть пустым"}/>}
                        {(!password.passwordsAreEqual || !passwordRepeat.passwordsAreEqual) &&!(passwordRepeat.passwordsAreEqual || password.passwordsAreEqual) && <OutputAlert message={"Пароли не совпадают"}/> }
                    </Form.Group>
                    <Button onClick={()=>{
                        setConfirmation(true);
                        setAdditional(false)

                        checkPassword();
                    registration();
                    }} >Зарегестрироваться</Button>
                </Form>
            </div>


        )
    }


    if(AdditionalActive) {
        return chainExample()
    }
}

const ConfirmationAnimation=({confirmation, setConfirmation ,setActive})=>{
    let navigate = useNavigate();
    const code = useInput('')
    const [pass,setPass] = useState(false)
    function confirm(){
        return axios({
            method: 'post',
            url: 'http://localhost:5000/api/confirmAccount',
            data: {
                email: regEmail,
                code: code.value,
            }
        }).then(res=>{
            alert(regEmail)
            alert(res.data.msg)
            return res.data.msg
        })
        }
    if(confirmation){
        return(
            <div className="confirm_modal">
                <p>на вашу почту было отправлено письмо с ссылкой на подтвеждения аккаунта, без него многие функции будут закрыты</p>
                <Form.Control  onChange={(e)=>{code.onChange(e)}} className="w-100" type="text" placeholder="Enter email"/>
                <Button className='btn btn-primary'  onClick={async()=>{
                   const res =await confirm();
                   if(res){
                      navigate('/main',{replace:true})
                   }
                }}>отправить</Button>
            </div>
        )
    }
}
const RegistrationMain= ({setActive,setAdditional, AdditionalActive, MainActive,setMainActive})=>{
    const email = useInput("",{isEmpty:true, emailError:false})
    const [showEmailError,setShowEmailError] = useState(false)
    function sendBaseData(){
        console.log(email.value)

        return axios.post('http://localhost:5000/api/findExisting', {
            email: email.value,
        }) // тут мы проверяем не занята ли почта
            .then(res => {
                console.log(res.data)
                if (!res.data.msg) {
                    console.log('данный почта занят, попробуйте другой')
                    setShowEmailError(true)
                    return false
                } else {
                    console.log('окей,свободно')
                    setShowEmailError(false)
                    return true
                }
            })
    }
    if(MainActive) {
        return (
            <div className="wrapper">
                <Row>
                    <Col></Col>
                    <Col><h3 style={{textAlign: "center"}}>Регистрация</h3></Col>
                    <Col className={'d-flex justify-content-end'}><CCloseButton onClick={() => {
                    setActive(false)}}/></Col>
                </Row>
                <Form className="form-main">
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <div className="registerImg-container">
                            <img src={registerImg} alt='image' style={{width: "80%", height: "200px"}}/>
                        </div>
                        {(email.isEmpty && email.isDirty) && <OutputAlert message={"поле не может быть пустым"} variant={"danger"} />}
                        {(email.emailError && email.isDirty) && <OutputAlert message={"Почта не валидна"} variant={"danger"} />}
                        <Form.Control value={email.value} className="w-100" type="text" placeholder="Enter email"
                                      onBlur={e => email.onBlur(e)} onChange={e => email.onChange(e)}/>
                        <Form.Text className="text-muted">
                            Мы никогда не делимся конфеденциальными данными
                        </Form.Text>
                    </Form.Group>
                    {showEmailError && <OutputAlert message={"Почта уже занята, попробуйте использовать другую"} variant={'danger'}/>}
                    <Button disabled={(!email.isValidGEN) }  className="btn btn-primary"
                            onClick={async() => {
                                const res =await sendBaseData();
                                regEmail = email.value
                                alert(regEmail)

                                if(res===true){
                                    setMainActive(false)
                                    setAdditional(true)
                                }
                                else if(res===false){
                                    setShowEmailError(true)
                                }
                            }
                            }>Отправить</Button>

                </Form>

            </div>
        )
    }
}



const ModalWindRegistration = ({active ,setActive,setAdditional,AdditionalActive, MainActive,setMainActive,confirmation,setConfirmation})=>{

        return (
            <div className={active ? 'modal-main active' : "modal-main"} onClick={() => {
                setActive(false)
            }}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <RegistrationMain AdditionalActive={AdditionalActive} setAdditional={setAdditional} MainActive={MainActive} setMainActive={setMainActive} setActive={setActive}/>
                    <RegistrationAdditional  AdditionalActive={AdditionalActive} setAdditional={setAdditional} setActive={setActive} setMainActive={setMainActive} confirmation={confirmation} setConfirmation={setConfirmation}/>
                    <ConfirmationAnimation confirmation={confirmation} setConfirmation={setConfirmation} setActive = {setActive}/>
                </div>
            </div>
        )

}



export default ModalWindRegistration;
