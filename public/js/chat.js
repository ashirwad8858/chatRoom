const socket = io()


const $messageForm = document.querySelector('#message-form')
const $messagFormInput = $messageForm.querySelector('input')
const $messagFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#location')
const $message = document.querySelector('#messages')  // here I will render html script


const messageTemplate = document.querySelector('#message-template').innerHTML //will access rendring division html
const locationMesageTemplate = document.querySelector('#loction-message-template').innerHTML


socket.on('message',(msg)=>{
    console.log(msg)
    const html = Mustache.render(messageTemplate, {
        msg 
    })

    $message.insertAdjacentHTML('beforeend',html)

})

socket.on('locationMessage',(url)=>{
    console.log(url)
    const html = Mustache.render(locationMesageTemplate,{
        url
    })

    $message.insertAdjacentHTML('beforeend',html)

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