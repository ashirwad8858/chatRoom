const users = []
 const addUser = ({ id, username, room })=>{
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate data
    if(!username || !room){
        return {
            error: 'Username and room is required'
        }
    }

    // checking for existing user
    const existingUser = user.find((user)=>{
        return user.room === room && user.username === username
    })

    if(existingUser){
        return {
            error : 'Username already exist'
        }
    }

    // store user
    const user = { id, username, room }
    users.push(user)
    return { user }
 }


 const  removeUser = (id)=>{
     const index = users.findIndex((user)=>{
         return user.id === id
     })

     if(index !== -1){
         return users.splice(index, 1)[0]
     }
 }


const getUser = (id)=>{
    return users.find((item)=> item.id === id)
}

const getUserInRoom = (room) =>{
    room=room.trim().toLowerCase()
    return users.filter((item)=> item.room === room)
}
//  addUser({
//      id:22,
//      username:'Ashirwad',
//      room:'abc'
//  })

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}