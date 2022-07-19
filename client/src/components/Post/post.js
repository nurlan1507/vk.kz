import React,{useState,useEffect, useMemo} from 'react'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import {Button} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImages,faMusic,faXmark } from '@fortawesome/free-solid-svg-icons'
import './post.css'
import Axios from '../../api/requests'




function InputField({avatar,status,setStatus}){
    let postText = null
    useEffect(()=>{
        try{
            const postInfo = JSON.parse(localStorage.getItem('UserPost'))
            const {postTextContent, postImages, postFiles, postAudio} = postInfo
            postText=postTextContent
            console.log(postText)
        }
        catch (e){

        }


    },[status])
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
    const [files , setFiles] = useState([])    // docs, pdf etc.
    const [audio , setAudio] = useState([])   //music
    const [mediaFilesPreview, setMediaFilesPreview] = useState([])  //images video gifs
    useEffect(()=>{
        try{
            const postInfo = JSON.parse(localStorage.getItem('UserPost'))
            const {postTextContent, postImages, postFiles, postAudio} = postInfo
            setMediaFilesPreview((old)=>[...old,postImages])
            setPostText(postTextContent)
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
            }
        }
        catch (e){

        }


    },[filesFiltrator,status])




    function closeModal(){
        localStorage.setItem('UserPost', JSON.stringify({
            postTextContent:postText,
            postImages: mediaFilesPreview,
            postFiles:files,
            postAudio:audio
        }))
        setStatus(false);
    }
    function deleteImage(e){

    }

    return(
        <div className={'modal-window-post'} onClick={()=>{closeModal()}}>
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
                                           <button type={"button"} className={'cross'}><FontAwesomeIcon icon={faXmark} style={{color:"white"}}/></button>
                                           <img src={mediaBase64} className={'image'}/>
                                       </div>
                                    })
                                ) :<div></div>
                            }
                        </div>
                        <div  className={'modal-window-post-tools'}>
                            <Form.Group controlId="formFile" className="mb-3">
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