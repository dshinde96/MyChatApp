import './CSS/Message.css';
const TextMessage = (props) => {
    const { msg } = props;
    return (
        <>
            <div className={`${msg.sender.email === sessionStorage.getItem("email") ? "sentmsg" : "recivedmsg"}`}>
                <spam>{msg.msgContent}</spam>
            </div>
        </>
    )
}
const downloadAttch = async (file) => {
    const url1 = 'http://localhost:8000/file/download';
    const response = await fetch(url1, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authTocken": sessionStorage.getItem('authTocken')
        },
        body: JSON.stringify(file),
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', file.filename); // Adjust filename as needed
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    return;
}
const Attachment = (props) => {
    const { msg } = props;
    return (
        <>
            <div className={`${msg.sender.email === sessionStorage.getItem("email") ? "sentattch" : "recivedattch"}`} onClick={() => downloadAttch({ filePath: msg.filePath, filename: msg.msgContent })}>
                <spam><img src="https://cdn-icons-png.flaticon.com/512/1388/1388902.png" style={{ height: "30px", width: "30px" }} /><p>{msg.msgContent}</p></spam>
            </div>
        </>
    )
}
const Message = (props) => {
    const { msg } = props;
    return (
        <>
            {msg.msgType == 'text' ? <TextMessage msg={msg} /> : <Attachment msg={msg} />}
        </>
    )
}

export default Message;