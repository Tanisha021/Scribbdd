const users = [];

const addUsers = ({id,name,room}) =>{
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = users.find((user) => user.name === name && user.room ===room);
    if(existingUser){
        return {error:"Username is alreadt taken"}
    }

    const user = {id,name,room};
    users.push(user)
    return {user};
}

const removeUser =(id) =>{
    const index = users.findIndex((user) =>user.id ===id)

    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

const getUser = (id) =>users.find((user) => user.id === id);

const getUserInRoom = (room) =>{
    return users.filter((user) => user.room ===room)
}

module.exports = {addUsers,removeUser,getUser,getUserInRoom}