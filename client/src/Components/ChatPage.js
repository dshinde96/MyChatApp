import { useContext, useEffect, useState } from "react";
import ChatContext from "../context/chatContext";
import io from 'socket.io-client';
import Nochat from './Nochat.gif';
import Message from "./Message";
import './CSS/Chatpage.css'

const ChatCnt = () => {
    const { curChat } = useContext(ChatContext);
    const [ChatMsg, setChatMsg] = useState([]);
    const [textMsg, setTextMsg] = useState();
    const [file,setfile]=useState();
    const [socket, setSocket] = useState();
    const [msgType,setMsgType]=useState('text');


    const img_src = "https://th.bing.com/th/id/R.9d32bec8058bd3595a63a08a8cc12ade?rik=9cCTin36GLU%2f5w&riu=http%3a%2f%2fcdn.onlinewebfonts.com%2fsvg%2fimg_87237.png&ehk=hVpH%2bC7rwlA1j2KqxGpMs1sp9l0RgM0jjRJsJsvDoPc%3d&risl=&pid=ImgRaw&r=0";

    useEffect(() => {
        if (!curChat._id || curChat._id == '') return;
        const s = io("http://localhost:8000/chat", {
            reconnectionDelayMax: 10000,
            auth: {
                token: sessionStorage.getItem('authTocken'),
                chatID: curChat._id
            }
        });
        setSocket(s);
        s.emit('loadChatMsg');
        const handleLoadChat = (chats) => {
            setChatMsg(chats);

        }
        s.on('loadChatMsg', handleLoadChat);
        return (() => {
            s.off('loadChatMsg', handleLoadChat);
        })
    }, [curChat]);

    useEffect(() => {
        if (!socket) return;
        const newMsgHandler = (newMsg) => {
            setChatMsg(ChatMsg => [...ChatMsg, newMsg]);
        }
        socket.on('newMsg', newMsgHandler);

        return (() => {
            socket.off('newMsg', newMsgHandler)
        })
    }, [socket])

    const uploadfile=async()=>{
        const formData=new FormData();
        formData.append('file',file);
        const url = `http://localhost:8000/file/upload`;
        const response = await fetch(url, {
            method: "POST",
            headers:{
                "authTocken":sessionStorage.getItem('authTocken')
            },
            body: formData,
        });
        const data=response.json();
        return data;
    }

    const SendMsg = async() => {
        if (!socket) return;
        if(msgType=='text'){
            if(!textMsg)return;
            socket.emit('newMsg', { data: textMsg,msgType, reciverID: curChat.reciver._id });
            setTextMsg('');
        }
        else{
            if(!file)return;
            const data=await uploadfile();
            socket.emit('newMsg', { data:data.file,msgType, reciverID: curChat.reciver._id });
        }
    }
    return (
        <>

            <div className="chatCnt">
                <div className="profileCnt">
                    <img src={img_src} style={{ height: "50px", width: "50px", backgroundColor: "white", borderRadius: "100%" }} />
                    <div className="profileContent">
                        <h5>{curChat.reciver.name}</h5>
                        <h6>{curChat.reciver.email}</h6>
                    </div>
                    <div></div>
                </div>
                <div className="msgCnt">
                    <div className="messages">
                        {ChatMsg && ChatMsg.map((msg) =>
                            {return (<Message msg={msg} key={msg._id}/>)}
                        )}
                    </div>
                    <div className="newMsgCnt">
                    <select onChange={(e)=>setMsgType(e.target.value)}>
                        <option value='text'>Text</option>
                        <option value='file'>Attachent</option>
                    </select>
                        {msgType=='text'?<input type='text' value={textMsg} className="mx-2" placeholder="Enter your Message" onChange={(e) => setTextMsg(e.target.value)} />:
                        <input type='file' className="mx-2" placeholder="Enter your Message" onChange={(e) => setfile(e.target.files[0])} />}
                        <button className="btn btn-primary mx-2" type="button" onClick={SendMsg}>Send</button>
                    </div>
                </div>
            </div>
        </>
    )
}
const Chat = () => {
    const { curChat } = useContext(ChatContext);
    return (
        <>
            {curChat ? <ChatCnt /> : <div style={{ width: "68%" }}><img src={Nochat} style={{ height: "100%", width: "100%" }} /></div>}
        </>
    )
}

export default Chat;