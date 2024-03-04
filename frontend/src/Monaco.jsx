import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react'

import { io } from "socket.io-client";
const socket = io("https://code-share.webpubsub.azure.com");

const Monaco = function () {
    const [value, setValue] = useState();
    useEffect(() => {
        socket.on("user-connected", (code) => {
            console.log(code);
            setValue(code);
        })
        socket.on("coding", (e) => {
            setValue(e);
        })
    }, [])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-black text-white">
            <h1 className='text-2xl md:text-4xl p-4 font-bold mb-8'>🚀 Live Coding! ✨</h1>
            <div className="w-4/5 bg-opacity-70 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 rounded-lg shadow-lg overflow-hidden">
                <Editor
                    height="80vh"
                    defaultLanguage="javascript"
                    theme='vs-dark'
                    value={value}
                    onChange={(e) => {
                        console.log(e);
                        const newValue = e;
                        setValue(newValue);
                        socket.emit("code", newValue);
                    }}
                    defaultValue='// Write your code here'
                    loading= {<><h3>Loading Code..</h3></>}
                />
            </div>
        </div>
    );
}

export default Monaco;
