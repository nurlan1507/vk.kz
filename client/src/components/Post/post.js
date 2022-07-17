import React,{useState,useEffect, useMemo} from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import {Button} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages,faMusic,faXmark } from '@fortawesome/free-solid-svg-icons'
import './post.css'
import Axios from '../../api/requests'











function InputField({avatar,status,setStatus}){
    const postInfo = JSON.parse(localStorage.getItem('UserPost'))
    console.log(postInfo)
    const {postTextContent, postImages, postFiles, postAudio} = postInfo
    useEffect(()=>{},[localStorage])
        return (
            <div className={'content'}>
                <div className={'input-field'}>
                    <div className={'input-field-content'}>
                        <img src={avatar} className={'avatar'} alt={'avatar'}/>
                        <input type={'text'} onClick={() => setStatus(true)} placeholder={(postTextContent ==='' || !postTextContent) ? 'Share your thoughts': postTextContent }
                               className={'input'}/>
                    </div>
                </div>
            </div>
        )
    }
const fileTypeRegex = /^image\/(gif|jpe?g|png)$|^application\/(csv|pdf|msword|(vnd\.(ms-|openxmlformats-).*))$|^text\/plain$/i
const docsRegex = /^application\/(csv|pdf|msword|(vnd\.(ms-|openxmlformats-).*))$|^text\/plain$/i
const imageTypeRegex = /image\/(png|jpg|jpeg)/gm





function ModalWindow({status,setStatus}){
    const [postText, setPostText] = useState('')
    const [filesFiltrator ,setFilesFiltrator ] = useState([])  //all files of all types goes here and then distributed to special array
    const [files , setFiles] = useState([])    // docs, pdf etc.
    const [audio , setAudio] = useState([])   //music
    const [mediaFilesPreview, setMediaFilesPreview] = useState([])  //images video gifs

   const postInfo= JSON.parse(localStorage.getItem('UserPost'))
    const {postImages} = postInfo
    console.log(postImages)
    useEffect(()=>{
        if(filesFiltrator.length){
            filesFiltrator.forEach((media)=>{
                console.log(media.type)
                const reader = new FileReader()
                reader.onloadend= ()=> {
                    if (media.type.match(docsRegex)) {
                        setFiles((old) => [...old, reader.result])
                        filesFiltrator.shift()
                    }
                    if (media.type.match(imageTypeRegex)) {
                        setMediaFilesPreview((old) => [...old, reader.result])
                        filesFiltrator.shift()
                    }
                }
                reader.readAsDataURL(media)
            })
            console.log(mediaFilesPreview)
            localStorage.setItem('UserPost', JSON.stringify({
                postTextContent:postText,
                postImages: mediaFilesPreview,
                postFiles:files,
                postAudio:audio
            }))

        }

    },[filesFiltrator])


    // const changeHandler = (e)=>{
    //     const {files} = e.target
    //     console.log(files)
    //     for(let i = 0; i < files.length; i++){
    //         let file = files[i]
    //         if(file.type.match(fileTypeRegex)){
    //             setFilesFiltrator(old=>[...old, file])
    //         }
    //         else{
    //             console.log('unsupported file mimetype')
    //         }
    //     }
    //     e.target.files=[]
    // }


    function setImages(e){
        Axios.uploadImage(e).then((res)=>{
            console.log(res.data)
        })
    }

    return(
        <div className={'modal-window-post'} onClick={()=>{setStatus(false)}}>
            <div className={'modal-window-content'} onClick={(e)=>e.stopPropagation()}>
                <form>
                    <div className={'modal-window-header'}>
                        <div className={'createPost'}>Create post</div>
                        <Button variant={'default'} onClick={()=>{setStatus(false)}}><FontAwesomeIcon icon={faXmark} style={{width:'25px',height:'25px'}}/></Button>
                    </div>
                    <div className={'modal-window-input'}>
                        <hr/>
                        <FloatingLabel controlId="floatingTextarea2" label="what are you thinking">
                            <Form.Control
                                as="textarea"
                                placeholder="what are you thinking"
                                style={{ height: '200px' }}
                                onChange={(e)=>{setPostText(e.target.value);
                                    console.log(postText)}}
                            />
                        </FloatingLabel>
                    </div>
                    <div className={'modal-window-post-status'}>
                        <div className={'images'}>
                            {
                                postImages.length ?(
                                    postImages.map((mediaBase64)=>{
                                       return <img src={mediaBase64} alt={'sd'} style={{width:"300px"}}/>
                                    })
                                ):<div>imags</div>
                            }
                        </div>
                        <div  className={'modal-window-post-tools'}>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>upload image</Form.Label>
                                <Form.Control type="file" onClick={(e)=>{e.target.files =null}} multiple  onChange={(e)=>{
                                    for(let i = 0 ; i < e.target.files.length; i++)
                                    setFilesFiltrator(old=>[...old, e.target.files[i]])
                                    e.target.files=[];
                                    console.log(e.target.files)}}/>
                            </Form.Group>

                        </div>
                    </div>
                    <Button onClick={()=>{
                        console.log('s')}} style={{background:'#E353D5',width:"100%"}}>Post</Button>
                </form>
            </div>
        </div>
    )
}


export {InputField,ModalWindow}