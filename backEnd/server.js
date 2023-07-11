const express= require('express');
const dotenv = require('dotenv');
const app=express();
const connectDB=require('./config/db')

//importing routes
const userRoutes=require('./routes/userRoutes')
const chatRoutes=require('./routes/chatRoutes')
const messageRoutes=require('./routes/messageRoutes')

//importing middleware
const {notFound,errorHandler}=require('./middleware/errorMiddleware')

//for loading .env file which is in backEnd directory 
dotenv.config()

// //for loading .env file which is in CHATAPP directory 
// dotenv.config({
//     path: '../my.env'

// });

//connection to database function
connectDB();



// since we are taking data from frontend it comes in the form of Json format so use express.json middleware to accept JSON data

app.use(express.json())

const chats = require('./data.js');

const PORT=process.env.PORT ;


//for register , Login and search user api
app.use('/api',userRoutes
);


// for chat related api
app.use('/api/chat',chatRoutes)


//for message related apis
app.use('/api/message',messageRoutes);


app.get("/api/chat/:id",(req,res)=>{
    const singleChat = chats.find((c)=>c._id===req.params.id );
res.send('hi')
});


//middleware
app.use(notFound)
app.use(errorHandler)



const server = app.listen(PORT,()=>{
    console.log(`app is running on ${PORT}`)
})


// storing io instance for using 
const io=require('socket.io')(server,{
    pingTimeout:60000,  // when there is no communication for 60 sec or inactive state it will be disconnected 
    cors:{
        origin:'http://localhost:3000' //to whom it is communicating
    }, 
})

io.on('connection',(socket)=>{
    console.log('connected to socket.io')

    socket.on('setup',(userData)=>{
        socket.join(userData._id) //creacting room for that particular user
        console.log(userData._id)
        socket.emit('connected')
    })

    socket.on("join chat", (room) => {
        socket.join(room); //when we click on particular chat this will create room for that logged in user and other users which want to chat in that room or chatId
        console.log("User Joined Room: " + room);
      })

      socket.on("typing", (room) => socket.in(room).emit("typing"));
      socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    
      
      socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
    
        if (!chat.users) return console.log("chat.users not defined");
    
        chat.users.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) return;
    
          socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
      });
    
      socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
    });

