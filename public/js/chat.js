const socket = io()

socket.on('countUpdate',(count)=>{
    console.log('The count has been update',count)
})

document.querySelector('#increment').addEventListener('click',()=>{
    console.log('clicked')
    socket.emit('increment') 
})