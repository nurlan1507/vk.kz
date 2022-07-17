import React, {useState} from "react";
import {Alert} from "react-bootstrap";



function OutputAlert(props) {
    const [show, setShow] = useState(true);
    if (show ) {

        return (<Alert style={{padding:"0",display:"flex", justifyContent:"space-between"}} variant={props.variant}>
             <div>{props.message}</div>
        </Alert>)
    }
}

export default OutputAlert