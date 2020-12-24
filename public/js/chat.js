const socket = io()


const $messageForm = document.querySelector('#message-form')
const $messagFormInput = $messageForm.querySelector('input')
const $messagFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#location')
const $message = document.querySelector('#messages')  // here I will render html script


const messageTemplate = document.querySelector('#message-template').innerHTML //will access rendring division html
const locationMesageTemplate = document.querySelector('#loction-message-template').innerHTML
const sidbarTemplate = document.querySelector('#sidebar-template').innerHTML

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix:true })


socket.emit('join',{ username, room },(error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }

})


socket.on('message',(msg)=>{
    console.log(msg)
    const html = Mustache.render(messageTemplate, {
        username : msg.username,
        message : msg.text,
        time: moment(msg.createdAt).format('h:mm a')
    })

    $message.insertAdjacentHTML('beforeend',html)

})

socket.on('locationMessage',(message)=>{
    // console.log(url)
    const html = Mustache.render(locationMesageTemplate,{
        url:message.text,
        time:moment(message.createdAt).format('h:mm a')
    })

    $message.insertAdjacentHTML('beforeend',html)

})

socket.on('roomData',({ room, users })=>{
    console.log(room, users)
    const html = Mustache.render(sidbarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault() //preventing the default behaviour of form. like refreshing page.
    $messagFormButton.setAttribute('disabled','disabled')
    let msg = e.target.elements.clientmsg.value
    socket.emit('clientMessage',msg,(returnMsg)=>{
        $messagFormButton.removeAttribute('disabled')
        $messagFormInput.value=''
        $messagFormInput.focus()

        if(returnMsg){
            return console.log(returnMsg)
        }
        
        console.log(msg)
    })
})



$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geoclocation is not supported by your browser')
    }

    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        $sendLocationButton.removeAttribute('disabled')
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