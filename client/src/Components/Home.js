import { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import ChatPage from "./ChatPage";
import ChatContext, { ChatState } from "../context/chatContext";
const Home = () => {
    const [newChatUser, setnewChatUser] = useState('');
    const { curChat,setcurChat } = useContext(ChatContext);
    const [socket, setSocket] = useState();
    const [errmsg, setErrmsg] = useState();
    const [chats, setChats] = useState([]);
    const img_src = "https://th.bing.com/th/id/R.9d32bec8058bd3595a63a08a8cc12ade?rik=9cCTin36GLU%2f5w&riu=http%3a%2f%2fcdn.onlinewebfonts.com%2fsvg%2fimg_87237.png&ehk=hVpH%2bC7rwlA1j2KqxGpMs1sp9l0RgM0jjRJsJsvDoPc%3d&risl=&pid=ImgRaw&r=0";
    const navigate = useNavigate();
    useEffect(() => {
        if (!sessionStorage.getItem('authTocken')) {
            navigate('/login');
        }
        const s = io.connect("http://localhost:8000/home", {
            reconnectionDelayMax: 10000,
            auth: {
                token: sessionStorage.getItem('authTocken'),
            }
        });
        setSocket(s);
        const handler = (Chats) => {
            setChats(Chats);
        }
        s.emit('getChats');
        s.on('loadChats', handler);
    }, []);
    useEffect(() => {
        if (!socket) return;
        const newChatHandler = (chat) => {
            if (chat === "User not found") {
                setErrmsg(chat);
                return;
            }
            const updateChats = [...chats, chat]
            setChats(chats => [...chats, chat]);
            setErrmsg('');
        }
        socket.on('newChat', newChatHandler);

        return (() => {
            socket.off('newChat', newChatHandler)
        })
    }, [socket]);
    const NewChat = () => {
        if (!newChatUser || socket == null)
            return;
        if(newChatUser===sessionStorage.getItem('email')){
           return setErrmsg('You are logged in with Same email');
        }
        socket.emit('newChat', newChatUser);
    }
    return (
        <>
            <Navbar />
            <div className="mainCnt">
                <div className="userCnt">
                    <div className="newUser">
                        <input type="text" placeholder="example@gmail.com" onChange={(e) => setnewChatUser(e.target.value)} />
                        <button type="button" className="btn btn-primary" onClick={NewChat}>New Chat</button>
                    </div>
                    <div style={{ margin:"0px",minHeight:"24px",color:"red",textAlign:"center"}}>{errmsg}</div>
                    <div className="UserMap">
                    {chats.map((chat) =>
                        <div className={`userTemp ${curChat!=='' && curChat===chat?"activeClass":""}` }onClick={() => setcurChat(chat)}>
                            <img className="reciverProfileImg" src={img_src} style={{ height: "50px", width: "50px", backgroundColor: "white", borderRadius: "100%" }} />
                            <div className="reciverProfile">
                                <h5>{chat.reciver.name}</h5>
                                <h6>{chat.reciver.email}</h6>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
                <ChatPage />
            </div>
        </>
    )
}

export default Home;