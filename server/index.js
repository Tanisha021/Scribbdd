const express = require("express")
const socketio = require('socket.io')
const http = require('http');
const exp = require("constants");
const { error } = require("console");
const PORT = process.env.PORT || 5000;
const router = require("./router");
const app = express()

const {addUsers,removeUser,getUser,getUserInRoom} = require("./users.js")


const server = http.createServer(app)
const io = socketio(server)

io.on('connection',(socket) =>{
    console.log("We have a new connection");
    socket.on('join',({name,room},callback)=>{
        //now here we have two things returning error message and user from the fucntion
        const {error,user} = addUsers({id:socket.id,name,room});
        if(error) return callback(error);
        // console.log(name,room)
        
        //user
        socket.emit('message',{user:'admin',text:`${user.name},welcome to the room ${user.room}`})
        //broadcast tells other users other than that user that he has joined
        socket.broadcast.to(user.room).emit('message',{user:'admin',text:`${user.name} has Joined!`})

        //if no error then join the room
        socket.join(user.room)

        // let error = true;
        // if(error){
        //     //ye jayega client side sending error in that socket
        //     callback({error:'error'}); //we can trigger callback emmeditealy after this socket.on eveent ids being emiited and we req it right here

        // }

        callback();
    })

    //expect event on backend
    socket.on('sendMessage',(message,callback)=>{
        const user = getUser(socket.id)

        io.to(user.room).emit('message',{user:user.name,text:message}) 
        callback();//so that we can do something after the message is sent to frontend
    })

    socket.on('disconnect',()=>{
        console.log("User has left")
    })
})

app.use(router)
server.listen(PORT,()=>console.log(`Server has started on port ${PORT}`))