const Chats = require('../Models/Chats');
const UserModel = require('../Models/User');

const handleGetChats = async (socket) => {
    // console.log(socket);
    const { user } = socket;
    let chats = await Chats.find({}).populate({ path: "participants.user", select: "name email _id" });
    chats = chats.filter((chat) => chat.participants.findIndex((participant) => String(participant.user._id) === user._id) != -1);
    let chatres = [];
    chats.forEach((chat) => {
        const reciver = chat.participants.findIndex((participant) => String(participant.user._id) !== user._id);
        chatres.push({ reciver: chat.participants[reciver].user, _id: chat._id });
    })
    socket.emit('loadChats', chatres);
}

const handleNewChat=async (socket,userEmail) => {
    const { user } = socket;
    const reciver = await UserModel.findOne({ email: userEmail }).select("name email _id");
    if (!reciver) {
        return socket.emit('newChat', "User not found");
    }
    let chat = await Chats.create({
        participants: [{
            user: user._id
        }, {
            user: reciver._id
        }],
        messages: []
    });
    socket.emit('newChat', { reciver, _id: chat._id });
    socket.broadcast.to(user._id).emit('newChat', { reciver, _id: chat._id });
    socket.broadcast.to(String(reciver._id)).emit('newChat', { reciver: user, _id: chat._id });
}

const handleLoadChatMsg=async (socket) => {
    const { chatID } = socket.handshake.auth;
    const chat = await Chats.findById(chatID).populate({ path: "messages.sender messages.reciver", select: "name email _id" });
    if (!chat) {
        socket.emit('loadChatMsg', chat)
        return;
    }
    const { messages } = chat;
    socket.emit('loadChatMsg', messages);
}

const handleNewMsg=async (socket,msg) => {
    const { chatID } = socket.handshake.auth;
    const { user } = socket;
    let chat = await Chats.findById(chatID);
    let newMsg = {};
    if(msg.msgType=='text'){
        newMsg={
            msgType: msg.msgType,
            sender: user._id,
            reciver: msg.reciverID,
            msgContent: msg.data,
            filePath:""
        }
    }
    else{
        newMsg={
            msgType: msg.msgType,
            sender: user._id,
            reciver: msg.reciverID,
            msgContent: msg.data.filename,
            filePath:msg.data.path
        }
    }
    chat.messages.push(newMsg);
    await Chats.findByIdAndUpdate(chatID, { $set: chat });
    socket.emit('newMsg', { msgContent: newMsg.msgContent, msgType: newMsg.msgType, sender: user, reciver: newMsg.reciver,filePath:newMsg.filePath });
    socket.broadcast.to(chatID).emit('newMsg', { msgContent: newMsg.msgContent, msgType: newMsg.msgType, sender: user, reciver: newMsg.reciver,filePath:newMsg.filePath });
}

module.exports= {handleNewChat,handleGetChats,handleLoadChatMsg,handleNewMsg}