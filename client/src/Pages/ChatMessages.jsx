import React, { useEffect, useRef, useState } from 'react'
import { Topbar } from '../Component'
import ChatBox from '../Component/ChatBox'
import ChatBar from '../Component/ChatBar'
import { UserChats, getUserInfo, requestApi } from '../utils'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {io} from 'socket.io-client'

function ChatMessages() {
    const {user ,edit} =  useSelector((state) => state.user)
    const {chat} =  useSelector((state) => state.chat)
    const[UserInfo , SetUserinfo] = useState(null)
    const[chats , setChats] = useState(null)
    const[onlineUsers , SetOnlineUsers] = useState([])
    const[sendMessage , SetsendMessage] = useState(null)
    const[recieveMessage , SetRecieveMessage] = useState(null)
    const {id} = useParams()
  
    const getUser = async() =>{
        const res = await getUserInfo(user?.token ,id)
       
        SetUserinfo(res)
      }
      //start a chat 
     
      useEffect(() =>{
       getUser()
      },[id])
    //   fetch the user chat
    useEffect(() => {
        const getChats = async () => {
          try {
            const res = await UserChats(user._id);
            console.log( " user chats found : " , res);
            setChats(res);
          } catch (error) {
            console.log(error);
          }
        };
        getChats();
      }, [user._id]);
//Socket implementation in client Side
   const socket  = useRef()
  
   useEffect(() =>{
    socket.current = io("http://localhost:5000");
    socket.current.emit('new-user-add', user?._id)
    socket.current.on('get-active-user' , (users) =>{
        SetOnlineUsers(users)
    })
   
    return () => {
      socket.current.disconnect();
  };
   },[user])
   useEffect(() =>{
    if(sendMessage!== null){
      console.log(sendMessage , "sendMessage");
        socket.current.emit('send-message' ,sendMessage)
    }
   
   }, [sendMessage])
   useEffect(() =>{
    
    socket.current.on('recieve-message', (data) => {
      console.log("Receiver message from socket", data);
      SetRecieveMessage(data);
  });
    console.log(recieveMessage ,  " is recieve message");
   },[])
   const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };
    return (
        <div className='home w-full px-0 md:px-4 pb-20 2xl:px-10 h-screen  bg-bgColor'>
            <ChatBar receiver={UserInfo} online ={ checkOnlineStatus(chat)}/>

            <div className='w-full flex gap-2 lg:gap-4 pt-5 pb-2 h-full'>
                {/* Left */}
                <div className=' w-full  md:flex flex-col gap-2 h-full'>
                    <ChatBox chat={chat} chats={chats} user={user} SetsendMessage={SetsendMessage} id={id} recieveMessage={recieveMessage}/>
                </div>
            </div>
        </div>
    )
}

export default ChatMessages
