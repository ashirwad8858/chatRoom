const socket = io()

socket.on('message',(msg)=>{
    console.log(msg)
})

socket.on('location',(lati,long)=>{
    console.log(lati,' ',long)
})
document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault() //preventing the default behaviour of form. like refreshing page.
    let msg = e.target.elements.clientmsg.value
    socket.emit('clientMessage',msg,(returnMsg)=>{
        if(returnMsg){
            return console.log(returnMsg)
        }
        
        console.log(msg)
    })
})



document.querySelector('#location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geoclocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        
        socket.emit('clientLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },(resMsg)=>{
            console.log(resMsg)
        })
    })
})
// socket.on('countUpdate',(count)=>{
//     console.log('The count has been update',count)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('clicked')
//     socket.emit('increment') 
// })