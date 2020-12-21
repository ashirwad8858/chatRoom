const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io') 


const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectryPath))


io.on('connection',()=>{
    console.log('New WebScoket connection')
})

server.listen(port,()=>{
    console.log(`Server is up and running ${port}`)
})