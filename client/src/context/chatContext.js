import { createContext, useState } from "react";

const ChatContext=createContext();

const ChatState=(props)=>{
    const [curChat,setcurChat]=useState('');

    return(
        <>
            <ChatContext.Provider value={{curChat,setcurChat}}>
                {props.children}
            </ChatContext.Provider>
        </>
    )
};

export default ChatContext;
export {ChatState};