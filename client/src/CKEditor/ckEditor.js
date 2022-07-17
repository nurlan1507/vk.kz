import React, {Component, useState} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import {Form} from "react-bootstrap";
import {Button} from "@mui/material";
import './ckeditor.css'



function CKeditor(){
    const [data , setData] = useState();
    return(
    <Form onSubmit={()=>{}}>
        <CKEditor className={'ckEditor'} editor={ClassicEditor} data={data}    onInit={(editor) => {
            // You can store the "editor" and use when it is needed.
            // console.log("Editor is ready to use!", editor);
            editor.editing.view.change((writer) => {
                writer.setStyle(
                    "width",
                    "200px",
                    editor.editing.view.document.getRoot()
                );
            });
        }}  config={ {
            toolbar: [
                'fontfamily', 'fontsize', '|',
                'alignment', '|',
                'fontColor', 'fontBackgroundColor', '|',
                'bold', 'italic', 'underline', '|',
                'link', '|',
                'bulletedList', 'numberedList', 'todoList', '|',
                'code', 'codeBlock', '|',
                'blockQuote', '|'],
        } } onChange={(e,editor)=>{const newData =editor.getData(); setData(newData);}} />
        <Button variant="primary" type="submit">
            Submit
        </Button>
    </Form>
    )
}

export default CKeditor