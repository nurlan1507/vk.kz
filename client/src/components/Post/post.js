import React,{useState,useEffect, useMemo} from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import {Button} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages,faMusic,faXmark } from '@fortawesome/free-solid-svg-icons'
import UserService from "../../api/userService";
import './post.css'





function InputField({avatar,status,setStatus}){
    let postText = null
        return (
            <div className={'content'}>
                <div className={'input-field'}>
                    <div className={'input-field-content'}>
                        <img src={avatar} className={'avatar'} alt={'avatar'}/>
                        <input type={'text'} onClick={() => setStatus(true)} placeholder={(postText ==='' || !postText) ? 'Share your thoughts': postText }
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
    const [imagesToPush, setImagesToPush] = useState([]) //array of images that will be pushed to backend
    const [files , setFiles] = useState([])    // docs, pdf etc.
    const [audio , setAudio] = useState([])   //music
    const [mediaFilesPreview, setMediaFilesPreview] = useState([])  //images video gifs
    useEffect(()=>{
        try{
            console.log(filesFiltrator)
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
                            setImagesToPush((old)=>[...old, media])
                            filesFiltrator.shift()
                        }
                    }
                    reader.readAsDataURL(media)
                })
                console.log(mediaFilesPreview)
            }
        }
        catch (e){
            alert('error occured line 65')
        }
    },[filesFiltrator])




    function closeModal(){
        setStatus(false);
    }

    function deleteImage(index){
        setMediaFilesPreview(mediaFilesPreview.filter(el=>el!==mediaFilesPreview[index]))
    }
        function createPost(){
        const formData = new FormData()
        formData.append('textContent', postText)
        formData.append('images', imagesToPush)
        const result = UserService.createPost(formData)
    }

    return(
        <div className={'modal-window-post'}>
            <div className={'modal-window-content'} onClick={(e)=>e.stopPropagation()}>
                <form>
                    <div className={'modal-window-header'}>
                        <div className={'createPost'}>Create post</div>
                        <Button variant={'default'} onClick={()=>closeModal()}><FontAwesomeIcon icon={faXmark} style={{width:'25px',height:'25px'}}/></Button>
                    </div>
                    <div className={'modal-window-input'}>
                        <hr/>
                        <FloatingLabel controlId="floatingTextarea2" label="what are you thinking">
                            <Form.Control
                                as="textarea"
                                placeholder="what are you thinking"
                                style={{ height: '200px' }}
                                value={postText}
                                onChange={(e)=>{setPostText(e.target.value)}}
                            />
                        </FloatingLabel>
                    </div>
                    <div className={'modal-window-post-status'}>
                        <div className={'images'}>
                            {
                                mediaFilesPreview.length ?(
                                    mediaFilesPreview.map((mediaBase64)=>{
                                       return <div style={{position:'relative',width:'fit-content'}}>
                                           <button onClick={(e)=>{deleteImage(mediaFilesPreview.indexOf(mediaBase64))}} type={"button"} className={'cross'}><FontAwesomeIcon icon={faXmark} style={{color:"white"}} /></button>
                                           <img src={mediaBase64} className={'image'}/>
                                       </div>
                                    })
                                ) :<div></div>
                            }
                        </div>
                        <div  className={'modal-window-post-tools'}>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Control type="file" id={'file'} onClick={(e)=>{e.target.files =null}} multiple  onChange={(e)=>{
                                    for(let i = 0 ; i < e.target.files.length; i++)
                                    setFilesFiltrator(old=>[...old, e.target.files[i]])
                                    e.target.files=[];
                                    console.log(e.target.files)}}/>
                            </Form.Group>

                        </div>
                    </div>
                    <Button onClick={()=>{
                       createPost()
                     }} style={{background:'#E353D5',width:"100%"}}>Post</Button>
                </form>
            </div>
        </div>
    )
}


export {InputField,ModalWindow}