const io = require('socket.io')(5000, {
    cors :{
        origin : "http://localhost:3000"
    }
})
let activeUser = [];

io.on("connection" , (socket) =>{

    socket.on('new-user-add' , (newUser) =>{
        if(!activeUser.some((user) => user?.userId === newUser?._id)){
            activeUser.push({
                userId : newUser,
                socketId: socket.id
            })
        }
        console.log(activeUser , "user active");
        io.emit("get-active-user" , activeUser)
    })
  
     socket.on("disconnect" , () =>{
        activeUser = activeUser.filter((user) => user?.socketId !== socket.id)
        io.emit("get-active-user" , activeUser)
     })


     socket.on('send-message' , (data) =>{
        const {recieverId} = data
        console.log(data , "data");
        console.log(activeUser.find(user => user?.userId));
        const user = activeUser.find((user) => user?.userId === recieverId)
        console.log(activeUser , "user active");
        console.log('send to the text : ' ,user); 
       
        if(user){
            console.log(user?.socketId , "user socketId");
            io.to(user?.socketId).emit('recieve-message' , data)
            console.log("called");
        }
    })
})