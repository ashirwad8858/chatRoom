const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io') 


// Creating express server
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectryPath))


io.on('connection',(socket)=>{
    console.log('New WebScoket connection')
    socket.emit('message','Welcome')  //sending message to client from server

    socket.broadcast.emit('message','A new user joined')
    socket.on('clientMessage',(msg)=>{
        io.emit('message',msg)
    })
    
    socket.on('disconnect',()=>{
        io.emit('message','A user has left')
    })

    // socket.on('increment',()=>{
    //     count++
    //     // socket.emit('countUpdate',count)
    //     io.emit('countUpdate',count)
    // })
})

server.listen(port,()=>{
    console.log(`Server is up and running ${port}`)
})