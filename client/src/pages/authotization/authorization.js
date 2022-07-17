import React, {useState, useEffect} from "react"
import {Button, Col, Container, Row, Form,Alert} from 'react-bootstrap'
import ModalWindRegistration from "./modal-window-registration";
import axios from "axios";
import OutputAlert from "../../components/services/alerts";
import { useNavigate } from 'react-router-dom';



import io from 'socket.io-client'




import AccessTokenGenerator from '../../AuthController/authControlle'
import setCookie from "../../CookieHooks/setCookie";




export default function Authorization({avatar,userInfo}){

    axios.defaults.withCredentials = true



    const [modalRegistration, setModalRegistration] = useState(false);
    const [modalRegistrationMain, setModalRegisterMain] = useState(true)
    const [modalRegistrationAdditional, setModalRegistrationAdditional] = useState(false)
    const [loginError, setLoginError] = useState('')
    const [confirmation,setConfirmation] = useState(false)
    //пост запрос чтобы зарегаться

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const navigate = useNavigate()


    function login(){
        axios({
            method:'post',
            url:"http://localhost:5000/api/login",
            data:{
                email:email,
                password:password,
            }
        }).then((res)=>{
            if(res.data.msg===true){
                const today = new Date()
                const tomorrow = new Date(today)
                tomorrow.setDate(tomorrow.getDate() + 1)
                alert('success_login')
                console.log(res.data)
                localStorage.setItem("accessToken", res.data.userData.tokens.accessToken)
                navigate('/main')
            }
            else{
              setLoginError(res.data.msg)
            }
        })
    }

    function getCookies(){
        axios({method:"GET", url:'http://localhost:5000/api/getCookies'
        }).then(res=>{
            console.log(res.data)
        })
    }


    return (
        <div>
        <Container fluid className="d-flex">
            <Col xs lg ="4" md="6" className="vh-100" style={{paddingTop :'200px'}} >
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Почта</Form.Label>
                        <Form.Control onChange={(e)=>{
                            setEmail(e.target.value)
                        }} type="text" placeholder="name@example.com" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control onChange={(e)=>{
                            setPassword(e.target.value)
                        }} type="password" placeholder="пароль" />
                    </Form.Group>
                    <Button onClick={login} variant="primary">Войти</Button>
                    <div>Нет аккаунта? <Button variant='success' onClick={()=>{
                        setModalRegistration(true)
                    }}>зарегестрироваться</Button></div>
                </Form>
                {loginError && <OutputAlert variant={'danger'}  message={loginError}/> }
            </Col>
            <Col xs lg ="8" md="6">
                <div className="d-flex align-items-center">
                    <img src={require("../../public/factory/logotype.png")} alt="LOGO" style={{width:"50px", height:"50px"}}/>
                </div>
                <Row style={{paddingBottom:"50px"}}>
                    <Col className="d-flex">
                        <div>Добро пожаловать!<br/>
                            Чтобы пользоваться предложенными функциями вам нужно войти/зарегистрироваться</div>
                    </Col>
                </Row>
            </Col>
            <Button onClick={getCookies}>dsd</Button>
        </Container>
        <ModalWindRegistration active={modalRegistration} setActive={setModalRegistration} AdditionalActive={modalRegistrationAdditional} setAdditional={setModalRegistrationAdditional} MainActive={modalRegistrationMain} setMainActive={setModalRegisterMain} confirmation={confirmation} setConfirmation={setConfirmation}/>
        </div>
    )
}
