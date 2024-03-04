import { useEffect, useState } from 'react'
import { io }  from "socket.io-client";
const socket = io("https://code-share.webpubsub.azure.com", {
  path: "/clients/socketio/hubs/Hub",
});


function App() {
  const [value, setValue] = useState("");

  useEffect(()=>{
    socket.on("user-connected", (code)=>{
      console.log(code);
      setValue(code);
    })
    socket.on("coding", (e)=>{
      setValue(e);
    })
  }, [])

  return (
    <>
    <textarea cols={100} rows={50} value={value}
     onChange={(e)=> {
      const newValue = e.target.value;
      setValue(newValue);
      socket.emit("code", newValue);
    }}/>
    </>
  )
}

export default App
