const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const PORT = 3000;
const app = express();
const { useAzureSocketIO } = require("@azure/web-pubsub-socket.io");


app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(3000);

  let code = "";


  useAzureSocketIO(io, {
    hub: "Hub", // The hub name can be any valid string.
    connectionString: process.argv[2]
  });

io.on("connection", (socket) => {
    console.log("User connected: ", socket.id); // x8WIv7-mJelg7on_ALbx
    socket.emit("user-connected", code)

    socket.on('disconnect', () => {
        console.log("User disconnected")
    })
    socket.on('code', (val)=>{
      socket.broadcast.emit("coding", val);
      code = val;
    })
  });

// app.get('/', (req, res)=>{
//     res.json({
//         msg: "Helllo"
//     })
// })

// server.listen(PORT, () => console.log(`Listening on ${PORT}`));