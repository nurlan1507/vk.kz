import React, {useState} from 'react';
import Navbar from '../../components/navbar/navbar'
import Sidebar from '../../components/carcas/carcas'
import {useNavigate} from "react-router-dom";
import {Container,Col,Row} from 'react-bootstrap'
import axios from "axios";
import {Button} from "@mui/material";
import AuthControlle from "../../AuthController/authControlle";
import {InputField,ModalWindow} from "../../components/Post/post";



export default function Main({avatar,userInfo}) {
    let navigate = useNavigate();
    const [postStatus, setPostStatus] = useState(false)

    function getUsers() {
        axios({
            method: "get",
            url: "http://localhost:5000/api/getUsers",
            withCredentials: true
        }).then((res) => {
            if (res.status === 200) {
                alert('adsada')
                AuthControlle.setNewToken()
                console.log(res.data)
            } else navigate('/auth')
        })
    }


    const wrapper = {
        paddingLeft: '120px',
        paddingRight: '120px',
        paddingBottom: 0,
        paddingTop: 0,
        background: '#EDEEF0',
    }
    const main = {
        paddingTop: '70px',

    }
    return (
        <>
        <> {postStatus && <ModalWindow status={postStatus} setStatus={setPostStatus}/>}</>
        <div className={'wrapper'} style={wrapper}>
            <Navbar avatar={avatar} userInfo={userInfo}/>
            <Row>
                <Col lg={3} md={3}>
                    <div style={main}>
                        <Sidebar/>
                    </div>
                </Col>
                <Col lg={6} md={6}>
                    <div style={main}> <InputField avatar={avatar} status={postStatus} setStatus={setPostStatus}/></div>

                </Col>
                <Col lg={3} md={3}>

                </Col>
            </Row>
            <Row>

            </Row>
        </div>
            </>
    )
}