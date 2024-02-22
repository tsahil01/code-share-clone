import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react'

import { io }  from "socket.io-client";
const socket = io("http://localhost:3000/");

const Monaco = function() {
    const [value, setValue] = useState("Hello");
    useEffect(()=>{
        socket.on("user-connected", (code)=>{
        console.log(code);
        setValue(code);
        })
        socket.on("coding", (e)=>{
            setValue(e);
        })
    }, [])

    return <Editor 
        height="90vh" 
        defaultLanguage="javascript" 
        theme='vs-dark'
        value={value}
        onChange={(e)=> {
            console.log(e);
            const newValue = e;
            setValue(newValue);
            socket.emit("code", newValue);
        }}
     />;
}

export default Monaco