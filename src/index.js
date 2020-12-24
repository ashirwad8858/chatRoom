const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io') 
const Filter = require('bad-words')
const { generateMessage } = require('./utils/mesage')
const { addUser, removeUser, getUser, getUserInRoom } = require('./utils/users')


// Creating express server
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectryPath))


io.on('connection',(socket)=>{
    console.log('New WebScoket connection')


    socket.on('join', (options,callback)=>{
        const { error, user } = addUser({ id:socket.id, ...options})

        if(error){
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message',generateMessage('Welcome'))  //sending message to client from server
        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined!`))

        callback()
    
    })

    socket.on('clientMessage',(msg,callback)=>{
        const filter = new Filter()
        if(filter.isProfane(msg)){
            return callback('profnilyt is not allowed')
        }
        
        io.to('abc').emit('message',generateMessage(msg))
        callback('Delivered')
    })
    
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message',generateMessage(`${user.username} has left`))
            
        }

    })

    socket.on('clientLocation',(coords,callback)=>{
        io.emit('locationMessage',generateMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback('Location Delivered')
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