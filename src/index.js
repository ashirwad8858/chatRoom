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
        socket.emit('message',generateMessage('Admin','Welcome'))  //sending message to client from server
        socket.broadcast.to(user.room).emit('Admin','message',generateMessage(`${user.username} has joined!`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUserInRoom(user.room)
        })
        callback()
    
    })

    socket.on('clientMessage',(msg,callback)=>{
        const user = getUser(socket.id)



        const filter = new Filter()
        if(filter.isProfane(msg)){
            return callback('profnilyt is not allowed')
        }
        
        io.to(user.room).emit('message',generateMessage(user.username,msg))
        callback('Delivered')
    })
    
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message',generateMessage(user.username,`${user.username} has left`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUserInRoom(user.room)
            })
        }

    })

    socket.on('clientLocation',(coords,callback)=>{

        const user = getUser(socket.id)

        io.to(user.room).emit('locationMessage',generateMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
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