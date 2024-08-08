require('dotenv').config()
const express = require('express');
const { Server } = require("socket.io");
const http = require('http');
const cors = require('cors');
const ConnectToMongo = require('./db');
const { AuthenticateUserForSocket } = require('./Middleware/Authentication');
const path = require('path');
const {handleNewChat,handleGetChats,handleLoadChatMsg,handleNewMsg}=require('./Controllers/ChatsController')


const app = express();
const PORT = process.env.PORT;
const mongoURL = process.env.MONGO_URL;
ConnectToMongo(mongoURL);

app.use(express.json());
app.use(cors());
// app.use(express.static(path.join(__dirname,'../client/build')));

//Routes
app.use('/user', require('./Routes/UserRoute'));   //userlogin and signup routes
app.use('/file',require('./Routes/FilesRoute'))    //file upload and download routes


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST']
    }
});
const Dashboard = io.of('/home');    //All chats info
const chat = io.of('/chat');         //Particular chat

Dashboard.use(AuthenticateUserForSocket);
chat.use(AuthenticateUserForSocket);

Dashboard.on('connection', (socket) => {
    const { user } = socket;
    socket.join(user._id);
    socket.on('getChats', ()=>handleGetChats(socket));
    socket.on('newChat', (userEmail)=>handleNewChat(socket,userEmail));    

})

chat.on('connection', (socket) => {
    const { chatID } = socket.handshake.auth;
    socket.join(chatID);
    socket.on('loadChatMsg', ()=>handleLoadChatMsg(socket))
    socket.on('newMsg',(msg)=> handleNewMsg(socket,msg))
})


server.listen(PORT, () => console.log(`Server Started on port: ${PORT}`));