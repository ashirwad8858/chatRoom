const socket = io()

socket.on('message',(msg)=>{
    console.log(msg)
})


document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault() //preventing the default behaviour of form. like refreshing page.
    let msg = e.target.elements.clientmsg.value
    socket.emit('clientMessage',msg)
})
// socket.on('countUpdate',(count)=>{
//     console.log('The count has been update',count)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('clicked')
//     socket.emit('increment') 
// })