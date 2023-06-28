const http = require("http")
const express = require("express")
const cors = require('cors')
const socketIO = require("socket.io")

const app = express()
const port = 4500 || process.env.PORT

const users = [{}]

app.use(cors())
app.get("/",(req,res)=>{
    res.send("HELLO ITS WORKING")
})

const server = http.createServer(app)

const io = socketIO(server)

io.on("connection",(socket)=>{
    console.log("NEW CONNECTION")

    socket.on('joined',({user})=>{
        users[socket.id]=user
        console.log(`${user} has joined`)
        socket.broadcast.emit('userjoined',{user:'Admin',message:`${users[socket.id]} has joined`})
        socket.emit('Welcome',{user:'Admin',message:`Welcome to the chat,${users[socket.id]}`})
    })

    socket.on('message',({message,id})=>{
     io.emit(`sendMessage`,{user:users[id],message,id})
    })
   socket.on('disconnect',()=>{
    socket.broadcast.emit('userdisconnected',{user:'Admin',message:`${users[socket.id]} has disconnected`})
    console.log(`User left`)
   })

})

server.listen(port,()=>{
    console.log(`server is working on http://localhost:${port}`)
})

